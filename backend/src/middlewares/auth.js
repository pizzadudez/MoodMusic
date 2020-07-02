const jwt = require('jsonwebtoken');
const { FRONTEND_URI, JWT_SECRET } = require('../config');

exports.authenticateJwt = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // TODO change where to redirect ??
  if (!token) return res.redirect(FRONTEND_URI);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload;
    next();
  });
};

exports.refreshJwt = (req, res, next) => {
  const { iat } = req.user;
  const duration = 60 * 2; // 2 min access_token
  const exp = iat + duration;
  const now = Math.floor(new Date() / 1000);

  console.log(exp - now, 'seconds');
  if (exp < now) {
    const oldJson = res.json;
    res.json = data => {
      res.json = oldJson;
      return res.json({ jwt: 'test', ...data });
    };
    console.log('access token expired');
  }
  next();
};
