const router = require('express').Router();
const AuthService = require('../services/auth_');
const UserModel = require('../models/User');
const { FRONTEND_URI } = require('../config');

// Start Authorization Flow
router.get('/', (req, res, next) => {
  res.redirect(AuthService.authUri());
});
// Check if authorized
router.get('/check', async (req, res, next) => {
  try {
    await UserModel.data();
    res.json({ authorized: true });
  } catch (err) {
    console.log(err);
    res.json({ authorized: false });
  }
});
// Request tokens using received code
router.get('/callback', async (req, res, next) => {
  try {
    const code = req.query.code || null;
    const tokens = await AuthService.requestTokens(code);
    await AuthService.registerUser(tokens);
    res.redirect(FRONTEND_URI);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
