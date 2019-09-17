const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./src/db.sqlite3', err => {
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

exports.set = (userId, accessToken, refreshToken) => {
  const sql = `INSERT INTO auth 
               (user_id, access_token, refresh_token, expires)
               VALUES(?, ?, ?, ?)`;
  const params = [userId, accessToken, refreshToken, 1]
  db.serialize(() => {
    db.run("DELETE FROM auth", err => err ? console.log(err) : {});
    db.run(sql, params, err => {
      if (err) {
        console.log(err);
      } else {
        console.log('added access_token to db');
      }
    });
  })
};

exports.update = (accessToken, refreshToken) => {
  const sql = `UPDATE auth SET access_token=?, refresh_token=?`;
  const params = [accessToken, refreshToken];
  db.run(sql, params, err => {
    if (err) {
      console.log(error);
    } else {
      console.log('update tokens');
    }
  });
};

exports.get = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM auth", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
};

