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

exports.create;

exports.update;

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
  await db.raw(
    `? ON CONFLICT (id) DO UPDATE SET
        snapshot_id = EXCLUDED.snapshot_id,
        track_count = EXCLUDED.track_count,
        updates = true
      WHERE playlists.snapshot_id != EXCLUDED.snapshot_id`,
    [db('playlists').insert(playlistList)]
  );
  // Select playlitIds with changes
  const condition = sync
    ? "type IN ('mix', 'label')"
    : "type IN ('mix') AND updates = TRUE";
  const playlistIds = db('playlists')
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
  // TODO: also set playlists updates to FALSE if data comes from refresh
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

exports.removePlaylists;

// Helpers
/**
 * Create hashMap of user's playlist's last track positions,
 * these can be different from playlist total track count.
 * @param {string} userId
 * @returns {Promise<Object<string, number>>}
 */
const getLastPositions = async userId => {
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
