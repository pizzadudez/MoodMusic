const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite3', err => {
  if (err) {
    console.log(err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS tracks (
            id TEXT UNIQUE,
            name TEXT,
            artist TEXT,
            album TEXT,
            PRIMARY KEY(id))`);
    console.log('Track Model loaded');
  }
});

exports.insertTracks = (tracks, playlist_id) => {
  const sql = `INSERT INTO tracks (
               id, name, artist, album)
               VALUES(?, ?, ?, ?)`;
  const sql2 = `INSERT INTO tracks_playlists (
                track_id, playlist_id)
                VALUES(?, ?)`;
  tracks.forEach(track => {
    const values = [
      track.id,
      track.name,
      track.artist,
      track.album,
    ];
    db.serialize(() => {
      db.run(sql, values, err => {
        if (err && err.code !== 'SQLITE_CONSTRAINT') { console.log(err); }
      });
      db.run(sql2, [track.id, playlist_id], err => {
        if (err && err.code !== 'SQLITE_CONSTRAINT') { console.log(err); }
      })
    });
  });
};