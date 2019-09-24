const router = require('express').Router();
const AuthService = require('../services/auth');

// Start Authorization Flow
router.get('/', (req, res, next) => {
  res.redirect(AuthService.authUri());
});
// Request tokens using received code
router.get('/callback', async (req, res, next) => {
  try {
    const code = req.query.code || null;
    const tokens = await AuthService.requestTokens(code);
    await AuthService.registerUser(tokens);
    res.redirect('/');
  } catch (err) {
    res.send(err);
  }
});
// Refresh token
router.get('/refresh_token', async (req, res, next) => {
  try {
    await AuthService.refreshToken();
    res.redirect('/');
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;