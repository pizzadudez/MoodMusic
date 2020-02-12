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
// TODO: add position
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

// Upsert playlits and return list tracked playlists with changes
exports.refresh = data => {
  const insertSql = `INSERT INTO playlists
    (id, name, snapshot_id, tracks_num)
    VALUES (?, ?, ?, ?)`;
  const updateSql = `UPDATE playlists
    SET snapshot_id=?, changes=?, tracks_num=?
    WHERE id=? AND snapshot_id!=?`;

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      data.forEach(pl => {
        const values = [pl.id, pl.name, pl.snapshot_id, pl.tracks_num];
        db.run(insertSql, values, err => {
          if (err && err.code !== 'SQLITE_CONSTRAINT') {
            reject(new Error(err.message));
          } else if (err) {
            const values = [
              pl.snapshot_id,
              1,
              pl.tracks_num,
              pl.id,
              pl.snapshot_id,
            ];
            db.run(updateSql, values, err => {
              if (err) reject(new Error(err.message));
            });
          }
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(getTrackedWithChanges());
        }
      });
    });
  });
};
// Use after adding new Tracks
exports.setNoChanges = list => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE playlists SET changes=0 WHERE id=?`;
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      list.forEach(id => {
        db.run(sql, [id], err => {
          if (err) reject(new Error(err.message));
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

// Helpers
const getTrackedWithChanges = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM playlists WHERE changes=1 AND tracking=1`;
    db.all(sql, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(rows.map(row => row.id));
      }
    });
  });
};
const getTracked = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM playlists WHERE tracking=1`;
    db.all(sql, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(rows.map(row => row.id));
      }
    });
  });
};
