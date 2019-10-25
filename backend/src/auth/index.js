const router = require('express').Router();
const config = require('../config');
const AuthService = require('../services/auth');
const UserModel = require('../models/User');

// Start Authorization Flow
router.get('/', (req, res, next) => {
  res.redirect(AuthService.authUri());
});
// Check if authorized
router.get('/check', async (req, res, next) => {
  try {
    await UserModel.userData();
    res.json({ authorized: true });
  } catch (err) {
    res.json({ authorized: false });
  }
});
// Request tokens using received code
router.get('/callback', async (req, res, next) => {
  try {
    const code = req.query.code || null;
    const tokens = await AuthService.requestTokens(code);
    await AuthService.registerUser(tokens);
    res.redirect(config.frontendUri);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;