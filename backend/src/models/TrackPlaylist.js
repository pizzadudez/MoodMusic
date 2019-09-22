const db = require('../db').conn();

exports.insertTracks = (tracks, playlist_id) => {
  if (!tracks) return;
  const sql = `INSERT INTO tracks_playlists (
               track_id, playlist_id)
               VALUES(?, ?)`;
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    tracks.forEach(track => {
      db.run(sql, [track.id, playlist_id], err => {
        if (err && err.code !== 'SQLITE_CONSTRAINT') { console.log(err); }
      });
    });
    db.run("COMMIT TRANSACTION");
  });
};