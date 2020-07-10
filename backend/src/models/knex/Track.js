const db = require('../../../db/knex');

/**
 *
 * @param {UserObj} userObj
 * @param {ParsedTrack[]} trackList - List of parsed Spotify TrackObjects.
 * @param {boolean=} liked - Set true if the list of tracks is from Liked Songs.
 * @param {boolean=} sync
 */
exports.addTracks = async (userObj, trackList, liked = false, sync = false) => {
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
        user_id: userObj.userId,
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
