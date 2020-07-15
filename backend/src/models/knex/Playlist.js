const db = require('../../../db/knex');
const { chunkArray } = require('../../utils');
const { last } = require('lodash');

/**
 * Upsert user's playlists, returns list of playlists to refresh tracks for.
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
 * Handle Playlist-Track associations.
 * @param {string} userId
 * @param {PlaylistTracks[]} list - Accepts both tracks and track_ids
 * @param {boolean=} sync
 */
exports.addPlaylists = async (userId, list, sync = false) => {
  const lastPositions = await getLastPositions(userId);
  const data = list
    .map(({ playlist_id, tracks, track_ids }) => {
      if (tracks) {
        // Handle user adding duplicate tracks through Spotify
        const hashMap = {};
        const trackList = tracks.map((track, idx) => {
          if (hashMap[track.id]) return;
          hashMap[track.id] = true;
          return {
            playlist_id,
            track_id: track.id,
            added_at: track.added_at,
            position: sync ? idx : idx + 1 + (lastPositions[playlist_id] || -1),
          };
        });
        return trackList;
      } else {
        return track_ids.map((id, idx) => ({
          playlist_id,
          track_id: id,
          position: idx + 1 + (lastPositions[playlist_id] || -1),
        }));
      }
    })
    .flat();
  console.time('tr');
  // Batch insert associations
  await db.transaction(async tr => {
    // delete if sync
    if (sync) {
      const playlists = list.map(playlistTracks => playlistTracks.playlist_id);
      console.time('delete');
      await tr('tracks_playlists').whereIn('playlist_id', playlists).del();
      console.timeEnd('delete');
    }

    const chunks = chunkArray(data, 1000);
    console.time('insert');
    for (const chunk of chunks) {
      await tr.raw(`? ON CONFLICT (track_id, playlist_id) DO ?`, [
        tr('tracks_playlists').insert(chunk),
        tr.raw(sync ? 'UPDATE SET position = EXCLUDED.position' : 'NOTHING'),
      ]);
    }
    console.timeEnd('insert');
  });
  console.timeEnd('tr');

  // TODO: try adding updated_at col, then delete tracks before timestamp
  //  this means they were not there for syncing - this might remove dupes too
  // TODO: also set playlists updates to FALSE if data comes from refresh

  /**
   * - syncing means we get all tracks in playlists so we would want to update
   * positions for every track in playlist
   * - if we get track_ids we insert them with pos: lastIdx + idx (addPlaylists req)
   * - if we get tracks it means its from refresh
   *  - if sync then:
   *    - CONSIDER: syncing is for 100% up to date, user might have added/removed tracks
   *      manually
   *    - delete all tracks from respective playlists
   *    - we get all tracks, insert in order with position=index
   *  - if not sync then:
   *    -
   */
};

// Helpers
/**
 * Returns a hashMap with a user's playlists and their last track's positions
 * @param {string} userId
 * @returns {Promise<object>}
 */
const getLastPositions = async userId => {
  /** @type {{id: string, last_pos: number}[]} */
  const rows = await db('tracks_playlists')
    .select(db.raw('playlist_id AS id, MAX(position) as last_pos'))
    .whereIn(
      'playlist_id',
      db('playlists').select('id').where('user_id', userId)
    )
    .groupBy('playlist_id');

  return Object.fromEntries(rows.map(({ id, last_pos }) => [id, last_pos]));
};
