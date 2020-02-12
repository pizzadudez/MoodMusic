const db = require('./db').conn();

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM playlists', (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const byId = Object.fromEntries(rows.map(row => [row.id, row]));
        resolve(byId);
      }
    });
  });
};
exports.addPlaylists = data => {
  const sql = `INSERT OR IGNORE INTO tracks_playlists
    (track_id, playlist_id, added_at)
    VALUES(?, ?, ?)`;
  const added_at = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      data.forEach(({ playlist_id, track_ids }) => {
        track_ids.forEach(id => {
          db.run(sql, [id, playlist_id, added_at], err => {
            if (err) reject(new Error(err.message));
          });
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve();
        }
      });
    });
  });
};
exports.removePlaylists = data => {
  const sql = `DELETE FROM tracks_playlists WHERE
  track_id=? AND playlist_id=?`;

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      data.forEach(({ playlist_id, track_ids }) => {
        track_ids.forEach(id => {
          db.run(sql, [id, playlist_id], err => {
            if (err) reject(new Error(err.message));
          });
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve();
        }
      });
    });
  });
};

// Takes list of playlists from refresh and returns playlists with changes
// and tracked
exports.refresh = data => {};
