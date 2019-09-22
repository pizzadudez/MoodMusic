const db = require('../db').conn();

// Adds or updates a playlist
exports.insertOrUpdate = (id, name, snapshot_id) => {
  const sql = `INSERT INTO playlists (
               id, name, snapshot_id, changes, tracking)
               VALUES(?, ?, ?, ?, ?)`;
  const values = [id, name, snapshot_id, 1, 0];
  db.run(sql, values, err => {
    if (err && err.code === 'SQLITE_CONSTRAINT') {
      const sql = `UPDATE playlists
                   SET snapshot_id=?, changes=?
                   WHERE id=? AND snapshot_id<>?`;
      const values = [snapshot_id, 1, id, snapshot_id];
      db.run(sql, values, function(err) {
        if (err) { 
          console.log(err) 
        } else if (this.changes) {
          console.log(`Playlist '${name}' has changes!`)
        }
      });
    } else if (err) {
      console.log(err);
    } else {
      console.log(`Playlist '${name}' added`);
    }
  });
};
// Playlist info promise
exports.get = (id) => {
  return new Promise((res, rej) => {
    const sql = "SELECT * FROM playlists WHERE id=?";
    db.get(sql, [id], (err, rows) => err ? rej(err) : res(rows));
  });
};
// List of playlist_ids with changes and tracked
exports.updates = () => {
  return new Promise((res, rej) => {
    const sql = "SELECT id FROM playlists";
    //const sql = "SELECT id FROM playlists WHERE tracking=1";
    //const sql = "SELECT id FROM playlists WHERE changes=1 AND tracking=1"
    db.all(sql, (err, rows) => err ? rej(err) : res(rows.map(row => row.id)));
  });
};
// Set the changes field to 0/1
exports.setChanges = (id, bool) => {
  const sql = "UPDATE playlists SET changes=? WHERE id=?";
  db.run(sql, [bool, id], err => err
    ? console.log(err)
    : console.log(`Playlist ${id} checked`)
  );
};