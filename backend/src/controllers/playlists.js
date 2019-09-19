const request = require('request');
require('dotenv').config({path: __dirname + '/../.env'});
const Auth = require('../models/Auth');
const Playlist = require('../models/Playlist');

exports.playlists = (req, response, next) => {
  Auth.getUserData().then((authData) => {
    const options = {
      url: 'https://api.spotify.com/v1/users/' + authData.user_id +'/playlists',
      headers: { 'Authorization': 'Bearer ' + authData.access_token },
      json: true,
    };
    request.get(options, (err, res, body) => {
      body.items.forEach((pl, idx) => {
        Playlist.insert(pl.id, pl.name, pl.snapshot_id);
      });
      const info = body.items.map(pl => ({ 
        'name': pl.name,
        'snapshot_id': pl.snapshot_id,
      }));
      response.send(info);
    });
  });
};

exports.tracks = (req, response, next) => {
  Auth.getUserData().then((authData) => {
    const filters = '?fields=items(track(name,artists(name)))';
    const options = {
      url: 'https://api.spotify.com/v1/playlists/' + req.params.playlist_id + '/tracks' + filters,
      headers: { 'Authorization': 'Bearer ' + authData.access_token },
      json: true,
    };
    request.get(options, (err, res, body) => {
      //const tracks = body.items.map(track => track.track.name);
      response.send(body);
    })
  });
};