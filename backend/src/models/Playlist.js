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
exports.addPlaylists = async (data, sync = false) => {
  const sql = `INSERT OR ${sync ? 'REPLACE' : 'IGNORE'} INTO tracks_playlists
    (track_id, playlist_id, added_at, position)
    VALUES(?, ?, ?, ?)`;
  const added_at = new Date().toISOString();
  const lastPositions = await getLastPositions();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      data.forEach(({ playlist_id, track_ids, tracks }) => {
        // track_ids from manual Add and tracks from refresh/sync
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

// Upsert playlits and return list of tracked playlists with changes
exports.refresh = (data, sync = false) => {
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
          resolve(sync ? getTracked() : getTracked(true));
        }
      });
    });
  });
};
// Used after Tracks refresh
exports.setNoChanges = playlists => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE playlists SET changes=0 WHERE id=?`;
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      playlists.forEach(({ id }) => {
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
const getTracked = (withChanges = false) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, tracks_num FROM playlists 
      WHERE tracking=1 ${withChanges ? 'AND changes=1' : ''}`;
    db.all(sql, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(rows);
      }
    });
  });
};
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
