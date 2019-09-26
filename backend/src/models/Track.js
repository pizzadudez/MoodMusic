const db = require('./db').conn();

exports.insertTracks = (tracks, playlistId) => {
  if (!tracks) return;
  const sqlTracks = `INSERT INTO tracks (
                     id, name, artist, album)
                     VALUES(?, ?, ?, ?)`;
  const sqlTracksPlaylists = `INSERT INTO tracks_playlists (
                              track_id, playlist_id, added_at)
                              VALUES(?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      tracks.forEach(t => {
        db.run(sqlTracks, [t.id, t.name, t.artist, t.album], err => {
          if (err && err.code !== 'SQLITE_CONSTRAINT') { reject(err); }
        });
        db.run(sqlTracksPlaylists, [t.id, playlistId, t.added_at], err => {
          if (err && err.code !== 'SQLITE_CONSTRAINT') { reject(err); }
        });
      });
      db.run("COMMIT TRANSACTION", err => {
        if (err) {
          reject(err);
        } else {
          resolve('success')
        }
      });
    });
  });
};