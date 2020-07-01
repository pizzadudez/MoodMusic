const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // TODO change where to redirect ??
  if (!token) return res.redirect(config.frontendUri);
  jwt.verify(token, config.jwtSecret, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload;
    next();
  });
};

module.exports = authenticateJWT;
