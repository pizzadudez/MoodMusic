const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite3', err => {
  if (err) {
    console.log(err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS playlists (
            id TEXT UNIQUE,
            name TEXT,
            snapshot_id TEXT,
            changes INTEGER,
            tracking INTEGER,
            PRIMARY KEY(id))`);
    console.log('Playlists Model loaded');
  }
});

exports.insertOrUpdate = (id, name, snapshot_id) => {
  const sql = `INSERT INTO playlists (
               id, name, snapshot_id, changes, tracking)
               VALUES(?, ?, ?, ?, ?)`;
  const values = [id, name, snapshot_id, 1, 0];
  db.run(sql, values, err => {
    if (err && err.code === 'SQLITE_CONSTRAINT') {
      const sql = `UPDATE playlists
                   SET snapshot_id=?, changes=?
                   WHERE id=? AND snapshot_id!=?`;
      const values = [snapshot_id, 1, id, snapshot_id];
      db.run(sql, values, err => {
        if (err) { console.log(err) } 
      });
    } else if (err) {
      console.log(err);
    } else {
      console.log(`Playlist '${name}' added`);
    }
  });
};

exports.get = (id) => {
  return new Promise((res, rej) => {
    const sql = "SELECT * FROM playlists WHERE id=?";
    db.all(sql, [id], (err, rows) => err ? rej(err) : res(rows[0]));
  });
};

// List of playlist_ids with changes and tracked
exports.updates = () => {
  return new Promise((res, rej) => {
    const sql = "SELECT id FROM playlists";
    db.all(sql, (err, rows) => err ? rej(err) : res(rows.map(row => row.id)));
  });
};

// Set changes to 0/1
exports.setChanges = (id, bool) => {
  const sql = "UPDATE playlists SET changes=? WHERE id=?";
  db.run(sql, [bool, id], err => err
    ? console.log(err)
    : console.log(`Playlist ${id} checked`)
  );
};