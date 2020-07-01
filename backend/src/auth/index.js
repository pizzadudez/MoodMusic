const router = require('express').Router();
const config = require('../config');
const AuthService = require('../services/auth');

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
      exp,
    } = await AuthService.requestTokens(code);
    const userObj = await AuthService.registerUser(
      access_token,
      refresh_token,
      exp
    );
    const jwt = AuthService.signJWT(userObj);
    // TODO change this to req.baseUrl
    // Send JWT in querystring
    res.redirect(config.frontendUri + `/?jwt=${jwt}`);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
