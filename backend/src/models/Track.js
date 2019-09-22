const db = require('../db').conn();

exports.insertTracks = tracks => {
  if (!tracks) return;
  const sql = `INSERT INTO tracks (
               id, name, artist, album)
               VALUES(?, ?, ?, ?)`;
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    tracks.forEach(track => {
      db.run(sql, [track.id, track.name, track.artist, track.album], err => {
        if (err && err.code !== 'SQLITE_CONSTRAINT') { console.log(err); }
      });
    });
    db.run("COMMIT TRANSACTION");
  });
};