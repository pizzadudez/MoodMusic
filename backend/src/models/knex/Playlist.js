const db = require('../../../db/knex');

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

  //if sync we delete
  db.transaction(async trx => {
    try {
      trx.commit();
    } catch (err) {
      trx.rollback();
      throw new Error(err.stack);
    }
  });
};
