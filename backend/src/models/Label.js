const db = require('./db').conn();

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM labels ORDER BY id', (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const byId = Object.fromEntries(rows.map(row => [row.id, row]));
        db.serialize(() => {
          const sql = 'SELECT id FROM labels WHERE parent_id=?';
          db.run('BEGIN TRANSACTION');
          Object.keys(byId)
            .filter(id => byId[id].type === 'genre')
            .forEach(id => {
              db.all(sql, [id], (err, rows) => {
                if (err) {
                  reject(new Error(err.message));
                } else if (rows.length) {
                  byId[id].subgenre_ids = rows.map(row => row.id);
                }
              });
            });
          db.run('COMMIT TRANSACTION', err => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(byId);
            }
          });
        });
      }
    });
  });
};
exports.addLabels = data => {
  const sql = `INSERT OR IGNORE INTO tracks_labels
    (track_id, label_id, added_at)
    VALUES(?, ?, ?)`;
  const added_at = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      data.forEach(({ label_id, track_ids }) => {
        track_ids.forEach(id => {
          db.run(sql, [id, label_id, added_at], err => {
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
exports.removeLabels = data => {
  const sql = `DELETE FROM tracks_labels WHERE
    track_id=? AND label_id=?`;

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      data.forEach(({ label_id, track_ids }) => {
        track_ids.forEach(id => {
          db.run(sql, [id, label_id], err => {
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
