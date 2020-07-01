const axios = require('axios');
const qs = require('querystring');
const config = require('../config');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/knex/User');

const authScopes = [
  // User info
  'user-read-email',
  'user-read-private',
  // Library
  'user-library-read',
  'user-library-modify',
  'playlist-modify-public',
  // Web SDK
  'streaming',
  // Others
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
].join(' ');

// Generate Spotify Authorization URI, can take custom clientId
exports.getAuthUrl = (clientId = config.clientId) => {
  return (
    'https://accounts.spotify.com/authorize?' +
    'client_id=' +
    clientId +
    '&response_type=code' +
    '&scope=' +
    encodeURIComponent(authScopes) +
    '&redirect_uri=' +
    encodeURIComponent(config.redirectUri)
  );
};

// Exchange authorization code for access + refresh tokens
exports.requestTokens = async (
  code,
  clientId = config.clientId,
  clientSecret = config.clientSecret
) => {
  const url = 'https://accounts.spotify.com/api/token';
  const data = qs.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.redirectUri,
  });
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        new Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
  };
  const response = await axios.post(url, data, config);
  const { access_token, refresh_token, expires_in } = response.data;

  return {
    access_token,
    refresh_token,
    exp: Math.floor(new Date() / 1000) + expires_in,
  };
};

// Registers user and returns the userObject for jwt signing
exports.registerUser = async (access_token, refresh_token, exp) => {
  const url = 'https://api.spotify.com/v1/me';
  const config = {
    headers: { Authorization: 'Bearer ' + access_token },
  };
  const { data } = await axios.get(url, config);
  const { id, email, display_name, images, premium } = data;
  // register user to db

  return {
    id,
    access_token,
    exp,
  };
};

exports.refreshToken;

exports.signJWT = payload => {
  return jwt.sign(payload, config.jwtSecret);
};
