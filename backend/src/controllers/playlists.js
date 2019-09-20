const request = require('request');
require('dotenv').config({path: __dirname + '/../.env'});
const Auth = require('../models/Auth');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const TrackPlaylist = require('../models/TrackPlaylist');

exports.playlists = (req, response, next) => {
  Auth.getUserData().then((authData) => {
    const options = {
      url: 'https://api.spotify.com/v1/users/' + authData.user_id +'/playlists',
      headers: { 'Authorization': 'Bearer ' + authData.access_token },
      json: true,
    };
    request.get(options, (err, res, body) => {
      body.items.forEach((pl, idx) => {
        Playlist.insertOrUpdate(pl.id, pl.name, pl.snapshot_id);
      });
      const info = body.items.map(pl => ({ 
        'name': pl.name,
        'id': pl.id,
        'snapshot_id': pl.snapshot_id,
      }));
      response.send(info);
    });
  });
};

exports.tracks = (req, response, next) => {
  Auth.getUserData().then(authData => {
    //const filters = '?fields=items(track(name,artists(name)))';
    const filters = '';
    const options = {
      url: 'https://api.spotify.com/v1/playlists/' + req.params.playlist_id + '/tracks' + filters,
      headers: { 'Authorization': 'Bearer ' + authData.access_token },
      json: true,
    };
    request.get(options, (err, res, body) => {

      //const tracks = body.items.map(track => track.track.name);
      const info = Object.keys(body.items[1].track);
      response.send(body.items[2].track);
    })
  });
};

exports.updateTracks = (req, response, next) => {
  // Get token
  Auth.getUserData().then(authData => {
    // Get id list
    Playlist.updates().then(playlistIds => {
      playlistIds.forEach(playlist_id => {
        const filters = '?fields=items(track(id,name,artists,album))';
        const options = {
          url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks' + filters,
          headers: { 'Authorization': 'Bearer ' + authData.access_token },
          json: true,
        };
        request.get(options, (err, res, body) => {
          const trackList = body.items.map(obj => ({
            'id': obj.track.id,
            'name': obj.track.name,
            'artist': obj.track.artists[0].name,
            'album': obj.track.album.name,
          }));
          // Add Tracks
          Track.insertTracks(trackList, playlist_id);
          Playlist.setChanges(playlist_id, 0);
        });
      });
    });
    response.send('OK');
  });
};