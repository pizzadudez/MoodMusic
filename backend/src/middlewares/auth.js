const jwt = require('jsonwebtoken');
const { FRONTEND_URI, JWT_SECRET } = require('../config');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // TODO change where to redirect ??
  if (!token) return res.redirect(FRONTEND_URI);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload;
    next();
  });
};

module.exports = authenticateJWT;
