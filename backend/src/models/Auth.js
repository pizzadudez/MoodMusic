const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite3', err => {
  if (err) {
    console.log(err);
    return;
  } else {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS auth (
              user_id TEXT UNIQUE,
              access_token TEXT,
              refresh_token TEXT,
              expires INTEGER)`);
      console.log('connected Auth Model')
    });
  }
});

exports.initUser = (userId, accessToken, refreshToken) => {
  const sql = `INSERT INTO auth 
               (user_id, access_token, refresh_token, expires)
               VALUES(?, ?, ?, ?)`;
  const params = [userId, accessToken, refreshToken, 1]
  db.serialize(() => {
    db.run("DELETE FROM auth", err => err ? console.log(err) : {});
    db.run(sql, params, err => {
      if (err) { console.log(err); }
    });
  })
};

exports.updateToken = (accessToken) => {
  db.run(`UPDATE auth SET access_token=?`, [accessToken, ], err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Refreshed access_token');
    }
  });
};

exports.getUserData = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM auth", (err, rows) => {
      if (err) {
        console.log('get error');
        reject(err);
      } else {
        console.log(rows[0]);
        resolve(rows[0]);
      }
    });
  });
};