const request = require('request');
require('dotenv').config({path: __dirname + '/../.env'});
const Auth = require('../models/Auth');

exports.playlists = (req, response, next) => {
  Auth.getUserData().then((authData) => {
    const options = {
      url: 'https://api.spotify.com/v1/users/' + authData.user_id +'/playlists',
      headers: { 'Authorization': 'Bearer ' + authData.access_token },
      json: true,
    };
    request.get(options, (err, res, body) => {
      const playlists = body.items.map(playlist => playlist.href);
      response.send(playlists);
    });
  });
};