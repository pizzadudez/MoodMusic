const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite3', err => {
  if (err) {
    console.log(err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS playlists (
            id TEXT UNIQUE,
            name TEXT,
            snapshot_id TEXT,
            tracking INTEGER,
            changes INTEGER,
            PRIMARY KEY(id))`);
    console.log('Playlists Model loaded');
  }
});

exports.insert = (id, name, snapshot_id) => {
  const sql = `INSERT INTO playlists (
               id, name, snapshot_id, tracking, changes)
               VALUES(?, ?, ?, ?, ?)`;
  const values = [id, name, snapshot_id, 0, 0];
  db.run(sql, values, err => err 
    ? err.code !== 'SQLITE_CONSTRAINT'
      ? console.log(err)
      : {}
    : console.log(`Playlist '${name}' added`)
  );
};