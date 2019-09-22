const request = require('request');
require('dotenv').config({path: __dirname + '/../.env'});
const Auth = require('../models/Auth');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const TrackPlaylist = require('../models/TrackPlaylist');

// Check for new playlists/playlist updates
exports.refreshPlaylists = async (req, response, next) => {
  try {
    const userData = await Auth.getUserData();
    const options = {
      url: 'https://api.spotify.com/v1/users/' + userData.user_id +'/playlists',
      headers: { 'Authorization': 'Bearer ' + userData.access_token },
      json: true,
    };
    request.get(options, (err, res, body) => {
      body.items.forEach((pl, idx) => {
        Playlist.insertOrUpdate(pl.id, pl.name, pl.snapshot_id);
      });
      response.send('Updated playlists');
    });
  } catch (err) {
    response.send(err);
  }
};
// Refresh Track and TrackPlaylist info
exports.refreshTracks = async (req, response, next) => {
  try {
    const accessToken = (await Auth.getUserData()).access_token;
    const playlistIds = await Playlist.updates();
    playlistIds.forEach(id => {
      const filters = '?fields=items(track(id,name,artists,album))';
      const options = {
        url: 'https://api.spotify.com/v1/playlists/' + id + '/tracks' + filters,
        headers: { 'Authorization': 'Bearer ' + accessToken },
        json: true,
      };
      request.get(options, async (err, res, body) => {
        const trackList = body.items.map(obj => ({
          'id': obj.track.id,
          'name': obj.track.name,
          'artist': obj.track.artists[0].name,
          'album': obj.track.album.name,
        }));
        await Track.insertTracks(trackList);
        await TrackPlaylist.insertTracks(trackList, id);
        Playlist.setChanges(id, 0);
      });
    });
  } catch (err) {
    response.send(err);
    return;
  }
  response.send('Updating tracks.');
};