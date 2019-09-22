const db = require('../db').conn();

// Inserts user data in auth table
exports.initUser = (userId, accessToken, refreshToken, expiresIn) => {
  const expires = Math.floor(Date.now()/1000) + expiresIn;
  const sql = `INSERT INTO auth 
               (user_id, access_token, refresh_token, expires)
               VALUES(?, ?, ?, ?)`;
  db.serialize(() => {
    db.run("DELETE FROM auth", err => err ? console.log(err) : {});
    db.run(sql, [userId, accessToken, refreshToken, expires], err => {
      if (err) { 
        console.log(err); 
      } else {
        console.log('User authenticated')
      }
    });
  })
};
// Updates access_token field
exports.updateToken = (accessToken, expiresIn) => {
  const expires = Math.floor(Date.now()/1000) + expiresIn;
  const sql = "UPDATE auth SET access_token=?, expires=?";
  db.run(sql, [accessToken, expires], err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`New access_token: ${accessToken}`);
    }
  });
};
// userData promise
exports.getUserData = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM auth", (err, rows) => {
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