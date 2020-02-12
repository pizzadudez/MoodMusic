const db = require('./db').conn();

exports.createUser = (userId, accessToken, refreshToken) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users 
                 (user_id, access_token, refresh_token)
                 VALUES(?, ?, ?)`;
    const values = [userId, accessToken, refreshToken];
    db.serialize(() => {
      db.run('DELETE FROM users');
      db.run(sql, values, err =>
        err ? reject(new Error(err.message)) : resolve('User Registered!')
      );
    });
  });
};
exports.userData = () => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * from users', (err, row) => {
      if (err) {
        reject(new Error(err.message));
      } else if (row) {
        resolve(row);
      } else {
        reject(new Error('Could not retrieve userData. Authenticate first!'));
      }
    });
  });
};
exports.updateToken = accessToken => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET access_token=?', [accessToken], err => {
      err ? reject(new Error(err.message)) : resolve();
    });
  });
};

exports.setLikedSongsTime = timestamp => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users set liked_songs_timestamp=?', [timestamp], err => {
      err ? reject(new Error(err.message)) : resolve();
    });
  });
};
