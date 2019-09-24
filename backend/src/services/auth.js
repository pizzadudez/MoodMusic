const request = require('request');
const config = require('../config');
const UserModel = require('../models/User');

// Spotify authorization uri
exports.authUri = () => {
  const scope = 'user-read-private user-read-email';
  const uri = 'https://accounts.spotify.com/authorize?' +
    'client_id=' + config.clientId + '&response_type=code' +
    (scope ? '&scope=' + encodeURIComponent(scope) : '') +
    '&redirect_uri=' + encodeURIComponent(config.redirectUri);
  return uri;
};
// Request access + refresh tokens
exports.requestTokens = code => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    },
    headers: { 
      'Authorization': 'Basic ' + 
      (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')) 
    },
    json: true,
  };
  return new Promise((resolve, reject) => {
    request.post(authOptions, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        reject('Authorization failed.');
      } else {
        resolve({
          accessToken: body.access_token,
          refreshToken: body.refresh_token,
          expiresIn: body.expires_in,
        });
      }
    });
  });
};
// Refresh accessToken
exports.refreshToken = async () => {
  try {
    const refreshToken = (await UserModel.getUser()).refresh_token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      headers: { 
        'Authorization': 'Basic ' + 
        (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')) 
      },
      json: true,
    };
  
    const res = await new Promise((resolve, reject) => {
      request.post(authOptions, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
    const message = await UserModel.updateToken(res.access_token, res.expires_in);
    console.log(message);
  } catch (err) {
    console.log(err);
  }
};
// Request userId and register
exports.registerUser = async tokensObj => {
  try {
    const userId = await new Promise((resolve, reject) => {
      const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + tokensObj.accessToken },
        json: true,
      };
      request.get(options, (err, res, body) => 
        err ? reject(err) : resolve(body.id)
      );
    });
    const message = await UserModel.createUser(userId, 
      tokensObj.accessToken, 
      tokensObj.refreshToken,
      tokensObj.expiresIn
    );
    console.log(message);
  } catch (err) {
    console.log(err);
  };
};