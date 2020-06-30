const db = require('../../db').conn();

exports.getAll = (byId = false) => {
  const selectSql = `SELECT l.*, p.id as playlist_id, (
      SELECT count(label_id) 
      FROM tracks_labels tl
      WHERE tl.label_id = l.id
    ) as track_count
    FROM labels l LEFT JOIN playlists p
    ON l.id = p.label_id
    ORDER BY l.id`;

  return new Promise((resolve, reject) => {
    db.all(selectSql, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const labelsById = Object.fromEntries(rows.map(row => [row.id, row]));
        db.serialize(() => {
          const sql = 'SELECT id FROM labels WHERE parent_id=?';
          db.run('BEGIN TRANSACTION');
          Object.keys(labelsById)
            .filter(id => labelsById[id].type === 'genre')
            .forEach(id => {
              db.all(sql, [id], (err, rows) => {
                if (err) {
                  reject(new Error(err.message));
                } else if (rows.length) {
                  labelsById[id].subgenre_ids = rows.map(row => row.id);
                }
              });
            });
          db.run('COMMIT TRANSACTION', err => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(byId ? labelsById : Object.values(labelsById));
            }
          });
        });
      }
    });
  });
};
exports.getAllById = () => {
  return exports.getAll(true);
};
exports.getOne = id => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM labels WHERE id=?', id, (err, label) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const sql = `SELECT group_concat(id) AS subgenre_ids
                       FROM labels WHERE parent_id=?`;
        db.get(sql, [id], (err, row) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve({
              ...label,
              ...(row.subgenre_ids && {
                subgenre_ids: row.subgenre_ids.split(',').map(Number),
              }),
            });
          }
        });
      }
    });
  });
};
exports.getTracks = (id, hashMap = false) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT track_id FROM tracks_labels
      WHERE label_id=? ORDER BY added_at DESC`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        hashMap
          ? resolve(Object.fromEntries(rows.map(row => [row.track_id, true])))
          : resolve(rows.map(row => row.track_id));
      }
    });
  });
};

exports.addLabels = labels => {
  const sql = `INSERT OR IGNORE INTO tracks_labels
    (track_id, label_id, added_at)
    VALUES(?, ?, ?)`;
  const added_at = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      labels.forEach(({ label_id, track_ids }) => {
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
exports.removeLabels = labels => {
  const sql = `DELETE FROM tracks_labels WHERE
    track_id=? AND label_id=?`;

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      labels.forEach(({ label_id, track_ids }) => {
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
// Removes all tracks_labels associations for a single label
exports.removeLabelTracks = id => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM tracks_labels WHERE label_id=?';
    db.run(sql, [id], err => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve();
      }
    });
  });
};

exports.create = data => {
  const values = [
    data.type,
    data.name,
    data.color,
    data.parent_id ? data.parent_id : null,
    data.verbose ? data.verbose : null,
    data.suffix ? data.suffix : null,
    new Date().toISOString(),
  ];
  const insertSql = `INSERT INTO labels
    (type, name, color, parent_id, verbose, suffix, created_at)
    VALUES(?, ?, ?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    const sql =
      data.type === 'subgenre'
        ? 'SELECT 1 FROM labels WHERE id=? AND type="genre"'
        : 'SELECT 1';
    db.get(sql, [data.parent_id], (err, row) => {
      if (err) {
        reject(new Error(err.message));
      } else if (!row) {
        reject(new Error('"parent_id" does not match a genre id.'));
      } else {
        db.run(insertSql, values, function (err) {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(exports.getOne(this.lastID));
          }
        });
      }
    });
  });
};
exports.update = (id, data) => {
  const sanitizedData = {
    ...(data.name && { name: data.name }),
    ...(data.color && { color: data.color }),
    ...(data.parent_id && { parent_id: data.parent_id }),
    ...(data.verbose && { verbose: data.verbose }),
    ...(data.suffix && { suffix: data.suffix }),
    updated_at: new Date().toISOString(),
  };
  const fields = Object.keys(sanitizedData)
    .map(key => key + '=?')
    .join(', ');
  const values = Object.values(sanitizedData);
  const updateSql = 'UPDATE labels SET ' + fields + ' WHERE id=?';

  return new Promise((resolve, reject) => {
    const sql = sanitizedData.parent_id
      ? 'SELECT 1 FROM labels WHERE id=? AND type="genre"'
      : 'SELECT 1';
    db.get(sql, sanitizedData.parent_id, (err, row) => {
      if (err) {
        reject(new Error(err.message));
      } else if (!row) {
        reject(new Error('"parent_id" does not match a genre id.'));
      } else {
        db.run(updateSql, [...values, id], function (err) {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(exports.getOne(id));
          }
        });
      }
    });
  });
};
exports.delete = id => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM labels WHERE id=?', [id], err => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve();
      }
    });
  });
};
