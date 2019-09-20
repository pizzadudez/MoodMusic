const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite3', err => {
  if (err) {
    console.log(err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS tracks_playlists (
            track_id TEXT,
            playlist_id TEXT,
            PRIMARY KEY(track_id, playlist_id))`);
    console.log('TrackPlaylist Model loaded');
  }
});

exports.insertTracks = (tracks, playlist_id) => {
  const sql = `INSERT INTO tracks_playlists (
               track_id, playlist_id)
               VALUES(?, ?)`;
  tracks.forEach(track => {
    const values = [track.id, playlist_id];
    db.run(sql, values, err => {
      if (err && err.code !== 'SQLITE_CONSTRAINT') { console.log(err); }
    });
  });
};