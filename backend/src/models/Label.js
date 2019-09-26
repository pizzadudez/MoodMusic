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
// Delete label
exports.delete = id => {
  const sql = `DELETE from labels WHERE id=?`;
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