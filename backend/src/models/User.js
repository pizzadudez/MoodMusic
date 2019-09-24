const db = require('./db').conn();

// Create User
exports.createUser = (userId, accessToken, refreshToken, expiresIn) => {
  const expires = Math.floor(Date.now()/1000) + expiresIn;
  const sql = `INSERT INTO users 
               (user_id, access_token, refresh_token, expires)
               VALUES(?, ?, ?, ?)`;
  const values = [userId, accessToken, refreshToken, expires];
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM users");
      db.run(sql, values, err => {err ? reject(err) : resolve('User Registered!')});
    });
  });
};
// Return User Data Object
exports.getUser = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * from users", (err, rows) => {
      if (err) {
        reject(err);
      } else if (!rows) {
        reject('Could not retrieve userData. Authenticate first!');
      } else {
        resolve(rows);
      }
    });
  });
};
// Update accessToken
exports.updateToken = (accessToken, expiresIn) => {
  const expires = Math.floor(Date.now()/1000) + expiresIn;
  const sql = "UPDATE users SET access_token=?, expires=?";
  return new Promise((resolve, reject) => {
    db.run(sql, [accessToken, expires], err => {
      if (err) {
        reject(err);
      } else {
        resolve(`New access_token: ${accessToken}`);
      }
    });
  });
}