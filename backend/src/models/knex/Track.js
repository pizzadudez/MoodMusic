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
  const data = trackList.reduce(
    (obj, track) => {
      obj.albums.push(track.album);
      obj.tracks.push({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album_id: track.album_id,
      });
      obj.userTracks.push({
        track_id: track.id,
        user_id: userId,
        liked,
        added_at: track.added_at,
      });
      return obj;
    },
    {
      albums: [],
      tracks: [],
      userTracks: [],
    }
  );

  return db.transaction(async trx => {
    const insertAlbums = trx.raw('? ON CONFLICT (id) DO NOTHING', [
      db('albums').insert(data.albums),
    ]);
    const insertTracks = trx.raw('? ON CONFLICT (id) DO NOTHING', [
      db('tracks').insert(data.tracks),
    ]);
    const insertUserTracks = trx.raw(
      '? ON CONFLICT (track_id, user_id) DO NOTHING',
      [db('tracks_users').insert(data.userTracks)]
    );
    await insertAlbums;
    await insertTracks;
    await insertUserTracks;
  });
};
