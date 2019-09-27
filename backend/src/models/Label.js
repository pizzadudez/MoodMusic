const db = require('./db').conn();

// Create new label with validation
exports.create = label => {
  const sql = `INSERT INTO labels (
               type, name, color, parent_id)
               VALUES(?, ?, ?, ?)`;
  let values = [
    label.type, 
    label.name, 
    label.color || null, 
    label.type === 'subgenre' ? label.parent_id : null
  ];
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const sqlSelect = "SELECT type, color FROM labels WHERE id=? AND type='genre'";
      db.get(sqlSelect, [label.parent_id], (err, rows) => {
        if (err) {
          reject(err);
        } else if (label.type === 'subgenre' && !rows) {
          reject('Invalid parent_id. Must be the id of a <genre> label.');
        } else if (label.type === 'subgenre' && rows && rows.type === 'genre') {
          // if no color inherit genre's color
          values[2] = values[2] === null ? rows.color : values[2];
        } 
        db.run(sql, values, err => err 
          ? reject(err)
          : resolve(`Created <${label.type}> label: '${label.name}'`));
      });
    });
  });
};
// Update existing label
exports.update = (id, update) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM labels WHERE id=?", [id], (err, rows) => {
      if (err) {
        reject(err);
      } else if (!rows) {
        reject(`There is no label with id: ${id}`);
      } else {
        // Format Update sql and values
        const label = {
          name: update.name || null,
          color: update.color || null,
          parent_id: rows.type === "subgenre" ? (update.parent_id || null) : null,
        };
        const fields = Object.keys(label).filter(key => label[key] !== null);
        if (fields.length === 0) {
          reject('No valid fields to update...');
        }
        const fieldsSQL = fields.map(field => field + '=?');
        const sql = "UPDATE labels SET " + fieldsSQL.join(', ') + " WHERE id=?";
        const values = Object.values(label).filter(val => val !== null);
        // Check subgenre parent_id constraints
        const selectParent = "SELECT type FROM labels WHERE id=? AND type='genre'";
        db.get(selectParent, [label.parent_id], (err, parentRow) => {
          if (err) {
            reject(err);
          } else if (parentRow && rows.type === 'subgenre' && parentRow.type !== 'genre') {
            reject('Invalid parent_id. Must be the id of a <genre> label.');
          } else {
            // Finally Update
            db.run(sql, [...values, id], err => err 
              ? reject(err)
              : resolve(`Updated label id: ${id}`));
          }   
        });
      }
    });
  });
};
// Delete label
exports.delete = id => {
  const sql = `DELETE FROM labels WHERE id=?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [id], function(err) {
      if (err) {
        reject(err);
      } else if (this.changes) {
        resolve(`Successfully removed label id: ${id}`);
      } else {
        reject(`There is no label with id: ${id}`);
      }
    });
  });
};
// Get label by id
exports.get = id => {
  const sql = `SELECT * FROM labels WHERE id=?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else if (!rows) {
        reject(`There is no label with id: ${id}`);
      } else {
        resolve(rows);
      }
    });
  });
};
// Get all label separated by type
exports.getAll = () => {
  const sql = `SELECT * FROM labels`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
// Add track-label relationships
// List of {track_id: id, label_ids: [label_id,]}
exports.addLabels = list => {
  if(!list) return;
  const added_at = new Date;
  const sql = `INSERT INTO tracks_labels (
               track_id, label_id, added_at)
               VALUES(?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      list.forEach(el => {
        const track_id = el.track_id;
        el.label_ids.forEach(label_id => {
          const values = [track_id, label_id, added_at];
          db.run(sql, values, err => {
            if (err) { reject(err); }
          });
        });
      });
      db.run("COMMIT TRANSACTION", err => {
        if (err) {
          reject(err);
        } else {
          resolve('Successfully added labels to tracks!');
        }
      });
    });
  });
};
// Remove track-label relationships
exports.removeLabels = list => {
  if(!list) return;
  const sql = `DELETE FROM tracks_labels WHERE
               track_id=? AND label_id=?`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      list.forEach(el => {
        const track_id = el.track_id;
        el.label_ids.forEach(label_id => {
          const values = [track_id, label_id];
          db.run(sql, values, err => {
            if (err) { reject(err); }
          });
        });
      });
      db.run("COMMIT TRANSACTION", err => {
        if (err) {
          reject(err);
        } else {
          resolve('Successfully removed labels from tracks!');
        }
      });
    });
  });
};