const db = require('./db').conn();

// Update Playlist model with up to date data
exports.update = playlists => {
  const insertSQL = `INSERT INTO playlists (
                     id, name, snapshot_id, changes, tracking)
                     VALUES (?, ?, ?, ?, ?)`;
  const updateSQL = `UPDATE playlists
                     SET snapshot_id=?, changes=?
                     WHERE id=? AND snapshot_id!=?`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      // INSERT || UPDATE
      playlists.forEach(pl => {
        const values = [pl.id, pl.name, pl.snapshot_id, 1, 0];
        db.run(insertSQL, values, err => {
          if (err && err.code === 'SQLITE_CONSTRAINT') {
            const values = [pl.snapshot_id, 1, pl.id, pl.snapshot_id];
            db.run(updateSQL, values, function(err) {
              if (err) {
                reject(err);
              } else if (this.changes) {
                console.log(`Playlist changed: '${pl.name}'`)
              }
            });
          } else if (err) {
            reject(err);
          } else {
            console.log(`Playlist added: '${pl.name}'`);
          }
        });
      })
      db.run("COMMIT TRANSACTION", err => {
        if (err) {
          reject(err);
        } else {
          resolve('Updated Playlist Model!')
        }
      });
    });
  });
};
// Get all playlists
exports.all = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM playlists";
    db.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });
};

exports.setChanges = (id, bool) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE playlists SET changes=? WHERE id=?`;
    db.run(sql, [bool ? 1 : 0, id], err => err ? reject(err) : resolve('success'));
  });
};

exports.setTracking = (id, bool) => {
  return new Promise ((resolve, reject) => {
    const sql = `UPDATE playlists set tracking=? WHERE id=?`;
    db.run(sql, [bool ? 1 : 0, id], err => err ? reject(err) : resolve('success'));
  });
};