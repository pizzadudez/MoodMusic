const express = require('express');
const router = express.Router();
require('dotenv').config({path: __dirname + '/../.env'});
const request = require('request');
const AuthModel = require('../models/Auth');

// Redirects to spotify's auth URI
router.get('/', (req, res, next) => {
  const scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    'client_id=' + process.env.CLIENT_ID +
    '&response_type=code' +
    (scope ? '&scope=' + encodeURIComponent(scope) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI)
  );
});

// Callback from auth
router.get('/callback', (req, res, next) => {
  const code = req.query.code || null;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: { 
      'Authorization': 'Basic ' + 
      (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) 
    },
    json: true,
  }

  request.post(authOptions, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.log('access token request error');
      return;
    }
    const access_token = body.access_token;
    const refresh_token = body.refresh_token
    // Get userId
    const options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { 'Authorization': 'Bearer ' + body.access_token },
      json: true,
    }
    request.get(options, (err, res, body) => {
      const user_id = body.id;
      AuthModel.get((err, data) => {
        console.log(data);
        console.log('after');
      })
      
    });
  });

  res.redirect('/');
});

module.exports = router;