const db = require('../../../db/knex');

/**
 * Insert new Tracks, Albums and Track-User associations
 * @param {string} userId
 * @param {ParsedTrack[]} trackList - List of parsed Spotify TrackObjects.
 * @param {boolean=} sync
 * @param {boolean=} liked - Set true if the list of tracks is from Liked Songs.
 */
exports.addTracks = async (userId, trackList, sync = false, liked = false) => {
  // TODO: sync liked tracks
  if (trackList.length < 1) return;
  const albums = trackList.map(track => track.album);
  const tracks = trackList.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artist,
    album_id: track.album_id,
  }));
  const userTracks = trackList.map(track => ({
    track_id: track.id,
    user_id: userId,
    liked,
    added_at: track.added_at,
  }));

  await db.transaction(async tr => {
    await tr('albums').bulkInsert(albums);
    await tr('tracks').bulkInsert(tracks);
    await tr('tracks_users').bulkInsert(userTracks);
  });
};
