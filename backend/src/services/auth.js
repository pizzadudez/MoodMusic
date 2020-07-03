const axios = require('axios');
const qs = require('querystring');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/knex/User');
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  JWT_SECRET,
} = require('../config');

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
exports.getAuthUrl = (clientId = CLIENT_ID) => {
  return (
    'https://accounts.spotify.com/authorize?' +
    'client_id=' +
    clientId +
    '&response_type=code' +
    '&scope=' +
    encodeURIComponent(authScopes) +
    '&redirect_uri=' +
    encodeURIComponent(REDIRECT_URI)
  );
};

// Exchange authorization code for access + refresh tokens
exports.requestTokens = async (
  code,
  clientId = CLIENT_ID,
  clientSecret = CLIENT_SECRET
) => {
  const url = 'https://accounts.spotify.com/api/token';
  const data = qs.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
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
    expires_in,
    iat: Math.floor(new Date() / 1000),
  };
};

// Registers user and returns the userObject for jwt signing
exports.registerUser = async (access_token, refresh_token, iat) => {
  const url = 'https://api.spotify.com/v1/me';
  const config = {
    headers: { Authorization: 'Bearer ' + access_token },
  };
  const { data } = await axios.get(url, config);
  const { id, email, display_name, images, premium } = data;
  // register user to db
  await UserModel.register(id, refresh_token);

  return {
    spotify_id: id,
    access_token,
    iat,
  };
};

exports.refreshToken = async spotify_id => {
  const refresh_token = await UserModel.getRefreshToken(spotify_id);
  // Get these from UserModel if use has his own app
  const clientId = CLIENT_ID;
  const clientSecret = CLIENT_SECRET;

  const url = 'https://accounts.spotify.com/api/token';
  const data = qs.stringify({
    grant_type: 'refresh_token',
    refresh_token,
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
  const { access_token, expires_in } = response.data;

  return {
    access_token,
    expires_in,
    iat: Math.floor(new Date() / 1000),
  };
};

exports.signJwt = payload => {
  return jwt.sign(payload, JWT_SECRET);
};
