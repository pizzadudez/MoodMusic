const db = require('../../../db/knex');

/**
 * Get user's playlists as an array.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
exports.getAll = userId => {
  return db('playlists')
    .select(
      'id',
      'name',
      'description',
      'track_count',
      'updates',
      'added_at',
      'type',
      'label_id'
    )
    .orderBy('added_at', 'desc')
    .where('user_id', userId);
};
/**
 * Get user's playlists as a byId object.
 * @param {string} userId
 * @returns {Promise<Object<string,object>>}
 */
exports.getAllById = async userId => {
  const playlists = await exports.getAll(userId);
  return Object.fromEntries(playlists.map(el => [el.id, el]));
};
/**
 * Get playlist byId
 * @param {string} userId
 * @param {string} id - playlistId
 * @returns {Promise<object>}
 */
exports.getOne = async (userId, id) => {
  const rows = await db('playlists')
    .select(
      'id',
      'name',
      'description',
      'track_count',
      'updates',
      'added_at',
      'type',
      'label_id'
    )
    .where({ id, user_id: userId });
  return rows[0];
};
/**
 * Create new playlist.
 * @param {string} userId
 * @param {NewPlaylist} data
 * @returns {Promise<object>} Created playlist
 */
exports.create = async (userId, data) => {
  await db('playlists').insert({ ...data, user_id: userId, updates: false });
  return exports.getOne(userId, data.id);
};
/**
 * Update existing playlist.
 * @param {string} userId
 * @param {string} id - playlistId
 * @param {object} data
 * @returns {Promise<object>} Updated playlist
 */
exports.update = async (userId, id, data) => {
  if (data.track_count_delta) {
    data.track_count = db.raw(`?? + ?`, [
      'track_count',
      data.track_count_delta,
    ]);
    delete data.track_count_delta;
  }

  await db('playlists').update(data).where({ id, user_id: userId });
  return exports.getOne(userId, id);
};
/**
 * Bulk update playlists. Can update track_count by passing
 * track_count_delta in the PlaylistUpdate object
 * @param {PlaylistChanges[]} updateList - List of { id, ...changes }
 */
exports.updateMany = async updateList => {
  if (updateList[0].track_count_delta) {
    // Custom update, we have to change track_count based on it current value.
    const updateSetStatement = `"snapshot_id" = "tmp"."snapshot_id",
      "track_count" = "track_count" + "tmp"."track_count_delta"::integer`;
    await db('playlists').bulkUpdate(updateList, undefined, updateSetStatement);
  } else {
    await db('playlists').bulkUpdate(updateList);
  }
};

/**
 * - Upsert user's playlists
 * - Return list of playlists to be refreshed/synced.
 * @param {string} userId
 * @param {ParsedPlaylist[]} playlistList
 * @param {boolean=} sync - Return all playlist ids (except untracked/deleted)
 * @returns {Promise<{id: string, track_count: number}[]>}
 */
exports.refresh = async (userId, playlistList, sync = false) => {
  if (playlistList.length < 1) return [];
  const onConflict = `ON CONFLICT (id) DO UPDATE SET
    snapshot_id = EXCLUDED.snapshot_id,
    track_count = EXCLUDED.track_count,
    updates = true
    WHERE playlists.snapshot_id != EXCLUDED.snapshot_id`;
  await db('playlists').bulkUpsert(playlistList, onConflict);
  // Select playlitIds with changes
  const condition = sync
    ? "type IN ('mix', 'label')"
    : "type IN ('mix') AND updates = TRUE";
  const playlistIds = await db('playlists')
    .select(['id', 'track_count'])
    .whereRaw(condition)
    .andWhere('user_id', userId);

  return playlistIds;
};
/**
 * Handle adding Playlist-Track associations.
 * @param {string} userId
 * @param {PlaylistTracks[]} list - Accepts both tracks and track_ids
 * @param {boolean=} sync
 */
exports.addPlaylists = async (userId, list, sync = false) => {
  const lastPositions = await getLastPositions(userId);
  const data = list
    .map(({ playlist_id, tracks, track_ids }) => {
      if (tracks) {
        // tracks from playlist refresh/sync
        const trackMap = tracks.reduce((obj, track, idx) => {
          obj[track.id] = obj[track.id] || {
            playlist_id,
            track_id: track.id,
            added_at: track.added_at,
            position: sync ? idx : idx + 1 + (lastPositions[playlist_id] || -1),
          };
          return obj;
        }, {});
        return Object.values(trackMap);
      } else {
        // track_ids from user request
        return track_ids.map((id, idx) => ({
          playlist_id,
          track_id: id,
          position: idx + 1 + (lastPositions[playlist_id] || -1),
        }));
      }
    })
    .flat();
  // Batch insert associations
  await db.transaction(async tr => {
    const onConflict = `ON CONFLICT (track_id, playlist_id) DO UPDATE SET 
        position = EXCLUDED.position, 
        updated_at = NOW()`;
    // Insert (or Upsert if sync) New Associations
    await tr('tracks_playlists').bulkUpsert(
      data,
      sync ? onConflict : undefined
    );
    // Remove associations that have not been upserted
    if (sync) {
      const playlists = list.map(playlistTracks => playlistTracks.playlist_id);
      await tr('tracks_playlists')
        .whereIn('playlist_id', playlists)
        .andWhere('updated_at', '<', tr.fn.now())
        .del();
    }
  });
};
/**
 * Handle removing Playlist-Track associations.
 * @param {PlaylistTracks[]} list
 */
exports.removePlaylists = async list => {
  const data = list
    .map(({ playlist_id, track_ids }) =>
      track_ids.map(track_id => ({
        playlist_id,
        track_id,
      }))
    )
    .flat();
  await db('tracks_playlists').bulkDelete(data, Object.keys(data[0]));
};
/**
 * Remove all track-playlist associations from a playlist.
 * @param {string} id - playlistId
 */
exports.removePlaylistTracks = async id => {
  await db('tracks_playlists').where('playlist_id', id).del();
};

// Helpers
/**
 * Create hashMap of user's playlist's last track positions,
 * these can be different from playlist total track count.
 * @param {string} userId
 * @returns {Promise<Object<string, number>>}
 */
const getLastPositions = async userId => {
  // TODO: refactor to get playlist_ids instead of userId
  const rows = await db('tracks_playlists')
    .select('playlist_id as id')
    .max('position as last_pos')
    .whereIn(
      'playlist_id',
      db('playlists').select('id').where('user_id', userId)
    )
    .groupBy('playlist_id');

  /** Join vs WhereIn Select, join seems slower the more data we have */
  // const rows = await db('tracks_playlists')
  //   .leftJoin('playlists', 'playlists.id', 'tracks_playlists.playlist_id')
  //   .select('playlist_id as id')
  //   .max('position as last_pos')
  //   .where('user_id', userId)
  //   .groupBy('playlist_id');

  return Object.fromEntries(rows.map(({ id, last_pos }) => [id, last_pos]));
};
