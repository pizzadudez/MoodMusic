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
                 id, name, snapshot_id, mood_playlist, changes)
                 VALUES (?, ?, ?, ?, ?)`;
    const values = [playlist.id, playlist.name, playlist.snapshot_id, 1, 0];
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
    // Check if playlist_id exists
    await getRow(id);
    const fields = {
      tracking: update.tracking,
      genre_id: update.genre_id,
      mood_playlist: update.mood_playlist
    };
    const fieldsValues = Object.values(fields)
      .filter(val => val != null)
      .map(val => typeof(val) === 'boolean' ? +val : val); 
    if (!fieldsValues.length) { return 'No valid fields to modify'; }
    const fieldsSQL = Object.keys(fields)
      .filter(key => fields[key] != null)
      .map(key => key + '=?')
      .join(', ');
    // Validate genre_id
    const validId = await validGenreId(update.genre_id);
    if (!validId) { return 'Invalid genre_id'; }
    // Update fields
    const message = await new Promise((resolve, reject) => {
      const sql = "UPDATE playlists SET " + fieldsSQL + " WHERE id=?";
      db.run(sql, [...fieldsValues, id], err => err
        ? reject(err)
        : resolve(`Updated playlist id: ${id}`));
    });
    return message;
  } catch (err) {
    console.log(err);
    return err;
  }
};
// Set playlist 'changes' true/false
exports.setChanges = (id, bool) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE playlists SET changes=? WHERE id=?`;
    db.run(sql, [bool ? 1 : 0, id], err => err ? reject(err) : resolve('success'));
  });
};

// Get all playlists
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM playlists";
    db.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });
};
// Get playlist by id
exports.get = id => {
  return getRow(id);
};

/* Helper functions */
// Checks if a given label_id is of type 'genre'
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
// Returns playlist_id row object
const getRow = id => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM playlists WHERE id=?", [id], (err, row) => {
      if (err) reject(err);
      else if (row) resolve(row);
      else reject(`Playlist id: '${id}' not found.`);
    });
  });
};
