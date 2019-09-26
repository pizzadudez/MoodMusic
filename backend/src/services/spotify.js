const request = require('request');
const config = require('../config');
const UserModel = require('../models/User');
const PlaylistModel = require('../models/Playlist');
const TrackModel = require('../models/Track');

// Request up to date playlist data from Spotify
exports.refreshPlaylists = async () => {
  try {
    const userData = await UserModel.getUser();
    const options = {
      url: 'https://api.spotify.com/v1/users/' + userData.user_id + '/playlists',
      headers: { 'Authorization': 'Bearer ' + userData.access_token },
      json: true,
    };
    const playlists = await new Promise((resolve, reject) => {
      request.get(options, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body.items.map(pl => ({
            'name': pl.name,
            'id': pl.id,
            'snapshot_id': pl.snapshot_id,
          })));
        }
      });
    });
    await PlaylistModel.update(playlists);
    return playlists;
  } catch (err) {
    console.log(err);
  }
};
// Update tracks from tracked playlists with changes
exports.refreshTracks = async () => {
  try {
    const filters = '?fields=items(track(id,name,artists,album),added_at)';
    const userData = await UserModel.getUser();
    const allPlaylists = await PlaylistModel.all()
    const playlists = allPlaylists.filter(pl => pl.changes === 1 && pl.tracking === 1);
    
    if (!playlists.length) {
      return 'No tracked playlist has changes.';
    }

    const promises = playlists.map(playlist => new Promise((resolve, reject) => {
      const options = {
        url: 'https://api.spotify.com/v1/playlists/' + playlist.id + '/tracks' + filters,
        headers: { 'Authorization': 'Bearer ' + userData.access_token },
        json: true,
      };
      request.get(options, async (err, res, body) => {
        if (err) { reject(err); }
        const tracks = body.items.map(obj => ({
          'id': obj.track.id,
          'name': obj.track.name,
          'artist': obj.track.artists[0].name,
          'album': obj.track.album.name,
          'added_at': obj.added_at,
        }));
        await TrackModel.insertTracks(tracks, playlist.id)
          .catch(err => rejecy(err));
        await PlaylistModel.setChanges(playlist.id, false)
          .catch(err => reject(err));
        resolve(`Playlist '${playlist.name}': new tracks added!`);
      });
    }));
    
    return await Promise.all(promises);
  } catch (err) {
    console.log(err);
  }
};