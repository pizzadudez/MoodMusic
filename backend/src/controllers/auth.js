const request = require('request');
require('dotenv').config({path: __dirname + '/../.env'});
const Auth = require('../models/Auth');

// Log into Spotify to authorize
exports.authorize = (req, res, next) => {
  const scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    'client_id=' + process.env.CLIENT_ID +
    '&response_type=code' +
    (scope ? '&scope=' + encodeURIComponent(scope) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI)
  );
};
// Oauth2 callback 
exports.authorizeCallback = (req, res, next) => {
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
    };
    request.get(options, (err, res, body) => {
      const user_id = body.id;
      // Update or Init auth data
      Auth.getUserData().then((data) => {
        if (!data || data.user_id !== user_id) {
          console.log('Added user credentials.')
        } else {
          console.log('User has already authorized the app.')
        }
        Auth.initUser(user_id, access_token, refresh_token);
      });      
    });
  });

  res.redirect('/');
};
// Request a new tokens using the refresh token
exports.refreshToken = (req, response, next) => {
  Auth.getUserData().then((authData) => {
    const refresh_token = authData.refresh_token;

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      headers: { 
        'Authorization': 'Basic ' + 
        (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) 
      },
      json: true
    };

    request.post(authOptions, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        console.log('Error requesting token refresh');
        return;
      } else {
        Auth.updateToken(body.access_token);
        response.redirect('/');
      }
    });
  });
};