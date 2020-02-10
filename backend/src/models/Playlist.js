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
