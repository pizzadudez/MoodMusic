const db = require('./db').conn();

// Create User
exports.createUser = (userId, accessToken, refreshToken) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users 
                 (user_id, access_token, refresh_token)
                 VALUES(?, ?, ?)`;
    const values = [userId, accessToken, refreshToken];
    db.serialize(() => {
      db.run("DELETE FROM users");
      db.run(sql, values, err => err ? reject(err) : resolve('User Registered!'));
    });
  });
};
// Return User Data Object
exports.userData = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * from users", (err, row) => {
      const notFound = 'Could not retrieve userData. Authenticate first!';
      err ? reject(err) : row ? resolve(row) : reject(notFound);
    });
  });
};
// Update accessToken
exports.updateToken = (accessToken) => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE users SET access_token=?", [accessToken], err => {
      err ? reject(err) : resolve("Refreshed access token!");
    });
  });
}