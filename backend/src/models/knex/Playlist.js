const db = require('../../../db/knex');
const { chunkArray } = require('../../utils');

/**
 * Upsert user's playlists, returns list of playlists to refresh tracks for.
 * @param {ParsedPlaylist[]} playlistList
 * @param {boolean=} sync - Return all playlist ids (except untracked/deleted)
 * @returns {Promise<{id: string, track_count: number}[]>}
 */
exports.refresh = async (playlistList, sync = false) => {
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
    .whereRaw(condition);

  return playlistIds;
};
/**
 * Handle Playlist-Track associations
 * @param {PlaylistTracks[]} list
 * @param {boolean=} sync
 */
exports.addPlaylists = async (list, sync = false) => {
  // TODO: also set playlists updates to FALSE if data comes from refresh
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const data = list
    .map(({ playlist_id, tracks, track_ids }) => {
      if (tracks) {
        return tracks.map(track => ({
          playlist_id,
          track_id: track.id,
          added_at: track.added_at,
        }));
      } else {
        return track_ids.map(id => ({
          playlist_id,
          track_id: id,
          added_at: timestamp,
        }));
      }
    })
    .flat();

  await db.transaction(async tr => {
    const chunks = chunkArray(data, 1000);
    for (const chunk of chunks) {
      await tr.raw('? O CONFLICT (track_id, playlist_id) DO NOTHING', [
        tr('tracks_playlists').insert(chunk),
      ]);
    }
  });

  /**
   * - syncing means we get all tracks in playlists so we would want to update
   * positions for every track in playlist
   * - if we get track_ids we insert them with idx: lastIdx + idx (addPlaylists req)
   * - if we get tracks it means its from refresh
   *  - if sync then:
   *    - CONSIDER: syncing is for 100% up to date, user might have added/removed tracks
   *      manually
   *    - delete all tracks from respective playlists
   *    - we get all tracks, insert in order with position=index
   *  - if not sync then:
   *    -
   */

  // create list of track_pl assoc (tr_id, pl_id, pos, added_at)
  // delete if if sync all assoc from playlists
  // insert

  //if sync we delete
  // db.batchInsert();
  // db.transaction(async trx => {
  //   try {
  //     trx.commit();
  //   } catch (err) {
  //     trx.rollback();
  //     throw new Error(err.stack);
  //   }
  // });
};
