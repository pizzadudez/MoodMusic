const db = require('./db').conn();

// Create new label with validation
exports.create = async label => {
  try {
    let values = [
      label.type, 
      label.name, 
      label.color || null, 
      label.type === 'subgenre' ? label.parent_id : null
    ];
    // check if parent_id is valid and inherit color if null
    await new Promise((resolve, reject) => {
      if (label.type !== 'subgenre') { resolve(); }
      const sql = "SELECT color FROM labels WHERE id=? AND type='genre'";
      db.get(sql, [label.parent_id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          values[2] = values[2] === null ? row.color : values[2];
          resolve();
        } else {
          reject('Invalid parent_id');
        }
      });
    });
    // Insert Label
    const message = await new Promise((resolve, reject) => {
      const sql = `INSERT INTO labels (type, name, color, parent_id)
                   VALUES(?, ?, ?, ?)`;
      db.run(sql, values, err => err 
        ? reject(err)
        : resolve(`Created <${label.type}> label: '${label.name}'`));
    });
    console.log(message);
    return message;
  } catch (err) {
    console.log(err)
    return err;
  }
};
// Update existing label
exports.update = async (id, update) => {
  try {
    const row = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM labels WHERE id=?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(`There is no label with id: ${id}`);
        } else {
          resolve(row);
        }
      });
    });
    const label = {
      name: update.name,
      color: update.color,
      parent_id: row.type === 'subgenre' ? (update.parent_id) : null,
    };
    const labelValues = Object.values(label)
      .filter(val => val != null);
    if (!labelValues.length) { return 'No valid fields to modify'; }
    const labelSQL = Object.keys(label)
      .filter(key => label[key] != null)
      .map(key=> key + '=?')
      .join(', ');
    console.log(labelValues);
    console.log(labelSQL);
    // Check if parent_id is valid
    await new Promise((resolve, reject) => {
      if (row.type !== 'subgenre') { resolve(); }
      const sql = "SELECT 1 FROM label WHERE id=? AND type='genre'";
      db.get(sql, label.parent_id, (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject('Invalid parent_id');
        } else {
          resolve();
        }
      });
    });
    // Update label
    const message = await new Promise((resolve, reject) => {
      const sql = "UPDATE labels SET " + labelSQL + " WHERE id=?";
      console.log(sql);
      db.run(sql, [...labelValues, id], err => err
        ? reject(err)
        : resolve(`Updated label id: ${id}`));
    });
    console.log(message);
    return message;
  } catch (err) {
    console.log(err);
    return err;
  }
};
// Delete label
exports.delete = id => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM labels WHERE id=?`;
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
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM labels WHERE id=?`;
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
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM labels`;
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