const router = require('express').Router();
const AuthService = require('../services/auth');
const { FRONTEND_URI } = require('../config');

// Redirect User to Spotify authorization url
router.get('/', (req, res) => {
  res.redirect(AuthService.getAuthUrl());
});

// Handle authorization code from Spotify
router.get('/callback', async (req, res) => {
  const { error, code } = req.query;
  if (error) {
    return res.status(200).send('Application has not been authorized :(');
  }
  try {
    const {
      access_token,
      refresh_token,
      iat,
    } = await AuthService.requestTokens(code);
    const userObj = await AuthService.registerUser(
      access_token,
      refresh_token,
      iat
    );
    const jwt = AuthService.signJWT(userObj);
    // TODO change this to req.baseUrl
    // Send JWT in querystring
    res.redirect(FRONTEND_URI + `/#jwt=${jwt}`);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
