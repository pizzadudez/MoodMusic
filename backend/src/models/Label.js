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
