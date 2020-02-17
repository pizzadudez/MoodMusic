const db = require('./db').conn();

exports.getAll = (byId = false) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, name, description, 
      track_count, updates, added_at, type, label_id
      FROM playlists ORDER BY added_at DESC`;
    db.all(sql, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(
          byId ? Object.fromEntries(rows.map(row => [row.id, row])) : rows
        );
      }
    });
  });
};
exports.getAllById = () => {
  return exports.getAll(true);
};
exports.getOne = id => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, name, description, 
      track_count, updates, added_at, type, label_id
      FROM playlists WHERE id=?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(row);
      }
    });
  });
};
exports.getTracks = (id, hashMap = false) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT track_id FROM tracks_playlists
      WHERE playlist_id=? ORDER BY position ASC`;
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

exports.addPlaylists = async (playlists, sync = false) => {
  const sql = `INSERT OR ${sync ? 'REPLACE' : 'IGNORE'} INTO tracks_playlists
    (track_id, playlist_id, added_at, position)
    VALUES(?, ?, ?, ?)`;
  const deleteSql = `DELETE FROM tracks_playlists WHERE playlist_id=?`;
  const added_at = new Date().toISOString();
  const lastPositions = await getLastPositions();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      playlists.forEach(({ playlist_id, track_ids, tracks }) => {
        if (sync) {
          db.run(deleteSql, [playlist_id], err => {
            if (err) reject(new Error(err.message));
          });
        }
        // track_ids are from manual Add; tracks from refresh/sync
        if (tracks) {
          tracks.forEach((track, idx) => {
            const values = [
              track.id,
              playlist_id,
              track.added_at,
              sync ? idx : idx + lastPositions[playlist_id] + 1,
            ];
            db.run(sql, values, err => {
              if (err) reject(new Error(err.message));
            });
          });
        } else {
          track_ids.forEach((id, idx) => {
            const values = [
              id,
              playlist_id,
              added_at,
              idx + lastPositions[playlist_id] + 1,
            ];
            db.run(sql, values, err => {
              if (err) reject(new Error(err.message));
            });
          });
        }
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
exports.removePlaylists = playlists => {
  const sql = `DELETE FROM tracks_playlists WHERE
  track_id=? AND playlist_id=?`;

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      playlists.forEach(({ playlist_id, track_ids }) => {
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
// Removes all tracks_playlists associations for a playlist (set untracked)
exports.removePlaylistTracks = id => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM tracks_playlists WHERE playlist_id=?';
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
  const values = Object.values(data);
  const sql = `INSERT INTO playlists 
    (id, name, description, track_count, snapshot_id,
    added_at, type, label_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    db.run(sql, values, function(err) {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(exports.getOne(this.lastID));
      }
    });
  });
};
exports.update = (id, data) => {
  const sanitizedData = {
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    ...(data.type && { type: data.type }),
    ...(data.type && data.label_id && { label_id: data.label_id }),
    ...(data.type && data.type !== 'label' && { label_id: null }),
    ...(data.type && { updates: 0 }), // type changed => already synced
    ...(data.snapshot_id && { snapshot_id: data.snapshot_id }),
    ...(data.track_count && { track_count: data.track_count }),
  };
  const fields = Object.keys(sanitizedData)
    .map(key => key + '=?')
    .join(', ');
  const values = Object.values(sanitizedData);

  return new Promise((resolve, reject) => {
    const sql = 'UPDATE playlists SET ' + fields + ' WHERE id=?';
    db.run(sql, [...values, id], function(err) {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(exports.getOne(id));
      }
    });
  });
};
// Update multiple playlists with changed fields [{id, ...changes}]
exports.updateMany = list => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      list.forEach(({ id, ...changes }) => {
        const fields = Object.keys(changes)
          .filter(key => key !== undefined)
          .map(key => key + '=?')
          .join(', ');
        const values = Object.values(changes).filter(val => val !== undefined);
        const sql = 'UPDATE playlists SET ' + fields + ' WHERE id=?';
        db.run(sql, [...values, id], err => {
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
// TODO + removed field in playlists
exports.delete = id => {};

// Upsert playlits and return which playlists to refresh/sync tracks from
exports.refresh = (data, sync = false) => {
  const insertSql = `INSERT INTO playlists
    (id, name, description, track_count,
    snapshot_id, added_at)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const updateSql = `UPDATE playlists
    SET snapshot_id=?, updates=1, track_count=?
    WHERE id=? AND snapshot_id!=?`;
  const added_at = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      data.forEach(pl => {
        const values = [
          pl.id,
          pl.name,
          pl.description,
          pl.track_count,
          pl.snapshot_id,
          added_at,
        ];
        // INSERT
        db.run(insertSql, values, err => {
          if (err && err.code !== 'SQLITE_CONSTRAINT') {
            reject(new Error(err.message));
          } else if (err) {
            const values = [
              pl.snapshot_id,
              pl.track_count,
              pl.id,
              pl.snapshot_id,
            ];
            // id conflict => UPDATE
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
          // Return playlists that match the criteria to be refreshed/synced
          const sql =
            'SELECT id, track_count FROM playlists WHERE ' +
            (sync
              ? `type IN ('mix', 'label')`
              : `type IN ('mix') AND updates=1`);
          db.all(sql, (err, rows) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(rows);
            }
          });
        }
      });
    });
  });
};

// Helpers
const getLastPositions = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT playlist_id, 
      max(position) AS last_position
      FROM tracks_playlists
      GROUP BY playlist_id`;
    db.all(sql, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(
          Object.fromEntries(
            rows.map(row => [row.playlist_id, row.last_position || -1])
          )
        );
      }
    });
  });
};
