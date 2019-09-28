const db = require('./db').conn();

// Update Playlist model with up to date playlist data and inserts new ones.
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

// Create playlist locally
exports.create = playlist => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO playlists (
                 id, name, snapshot_id, mood_playlist)
                 VALUES (?, ?, ?, ?)`;
    const values = [playlist.id, playlist.name, playlist.snapshot_id, 1];
    db.run(sql, values, err => err ? reject(err) : resolve());
  });
};
// Delete playlist locally
exports.delete = id => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM playlists WHERE id=?`;
    db.run(sql, [id], err => err ? reject(err) : resolve());
  });
};
// Modify playlist fields (api call)
exports.modify = async (id, update) => {
  try {
    const playlist = await getRow(id);
    const fields = {
      tracking: update.tracking,
      genre_id: update.genre_id,
      mood_playlist: update.mood_playlist
    };
    const fieldsValues = Object.values(fields)
      .filter(val => val != null)
      .map(val => typeof(val) === 'boolean' ? +val : val);
    const fieldsSQL = Object.keys(fields)
      .filter(key => fields[key] != null)
      .map(key => key + '=?')
      .join(', ');
    if (!fieldsValues.length) { return 'No valid fields to modify'; }
    
    const message = await validGenreId(update.genre_id);
    console.log('check')
  } catch (err) {
    console.log(err);
    return;
  }
}
// Set playlist has changes true/false
exports.setChanges = (id, bool) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE playlists SET changes=? WHERE id=?`;
    db.run(sql, [bool ? 1 : 0, id], err => err ? reject(err) : resolve('success'));
  });
};

// Get all playlists
exports.all = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM playlists";
    db.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });
};
// Get list of tracked playlist ids with changes
exports.trackedWithChanges = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id FROM playlists WHERE changes=1 AND tracking=1";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const ids = rows.reduce((arr, row) => {
          arr.push(row.id);
          return arr;
        }, [])
        resolve(ids);
      }
    });
  });
};
// Get hashMap of track_ids associated with the playlist id
exports.tracksHashMap = id => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT track_id FROM tracks_playlists WHERE playlist_id=?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const map = rows.reduce((map, row) => {
          map[row.track_id] = true;
          return map;
        }, {});
        resolve(map);
      }
    });
  });
};

/* Helper functions */
const getRow = id => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM playlists WHERE id=?", [id], (err, row) => {
      if (row) {
        resolve(row);
      } else {
        reject(`Playlist id: '${id}' not found.`);
      }
    });
  });
};
// 
const validGenreId = id => {
  if (!id) { return Promise.resolve(true); }
  return new Promise((resolve, reject) => {
    const sql = "SELECT 1 FROM labels WHERE id=? AND type='genre'";
    db.get(sql, id, (err, row) => {
      if (row) {
        resolve(true);
      } else {
        reject('Invalid genre_id');
      }
    });
  });
};
