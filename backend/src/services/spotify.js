const request = require('request');
const UserModel = require('../models/User');
const PlaylistModel = require('../models/Playlist');
const TrackModel = require('../models/Track');
const LabelModel = require('../models/Label');

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
// Get new Tracks from tracked playlists with changes
exports.refreshTracks = async () => {
  try {
    const playlistIds = await PlaylistModel.trackedWithChanges();
    if (!playlistIds.length) { return 'No tracked playlists have changes.'; }
    const userData = await UserModel.getUser();
    const filters = '?fields=items(track(id,name,artists,album),added_at)';
    
    // Promises to generate 'playlist-tracks' relation objects
    const promises = playlistIds.map(id => {
      return new Promise(async (resolve, reject) => {
        const hashMap = await PlaylistModel.tracksHashMap(id);
        const options = {
          url: 'https://api.spotify.com/v1/playlists/' + id + '/tracks' + filters,
          headers: { 'Authorization': 'Bearer ' + userData.access_token },
          json: true,
        };
        request.get(options, async (err, res, body) => {
          if (err) { reject(err); }
          const tracks = body.items.reduce((arr, obj) => {
            if (hashMap[obj.track.id]) {
              return arr;
            } else {
              const trackObj = {
                'id': obj.track.id,
                'name': obj.track.name,
                'artist': obj.track.artists[0].name,
                'album': obj.track.album.name,
                'added_at': obj.added_at,
              };
              return [...arr, trackObj];
            } 
          }, []);
          resolve({
            playlist_id: id,
            tracks: tracks,
          });
        });
      });
    });
    // list of {playlist_id: id, tracks: [trackObj]}
    const playlistsTracks = await Promise.all(promises);

    // new tracks
    const trackHashMap = await TrackModel.hashMap();
    const newTracks = playlistsTracks.reduce((arr, pl) => {
      const tracks = pl.tracks.filter(track => !trackHashMap[track.id]);
      return [...arr, ...tracks];
    }, []);
    await TrackModel.newTracks(newTracks);
    
    // tracks-playlists relationships
    const relPlaylists = playlistsTracks.map(pl => ({
      playlist_id: pl.playlist_id,
      track_ids: pl.tracks.map(track => track.id)
    }));
    await TrackModel.addTracks(relPlaylists);

    // tracks-labels relationships
    const promiseList = playlistsTracks.map(async pl => {
      const genreId = (await PlaylistModel.get(pl.playlist_id)).genre_id;
      const list = pl.tracks.map(track => ({
        track_id: track.id,
        label_ids: [genreId]
      }));
      return list;
    });
    const relLabels = (await Promise.all(promiseList)).flat(Infinity);
    await LabelModel.addLabels(relLabels);

    // Set the changes field to false on checked playlists
    playlistIds.forEach(id => PlaylistModel.setChanges(id, 0));
    console.log('New Tracks Added!');

  } catch (err) {
    console.log(err);
  }
};
// Create Playlist
exports.createPlaylist = async name => {
  try {
    const userData = await UserModel.getUser();
    const options = {
      url: 'https://api.spotify.com/v1/users/' + userData.user_id + '/playlists',
      headers: { 'Authorization' : 'Bearer ' + userData.access_token },
      body: {
        'name': name
      },
      json: true,
    };
    const res = await new Promise((resolve, reject) => {
      request.post(options, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
    const playlist = {
      id: res.id,
      name: res.name,
      snapshot_id: res.snapshot_id
    }
    await PlaylistModel.create(playlist);
    return playlist;
  } catch (err) {
    console.log(err);
  }
};
// 'Delete' playlist
exports.deletePlaylist = async id => {
  try {
    const userData = await UserModel.getUser();
    const options = {
      url: 'https://api.spotify.com/v1/playlists/' + id + '/followers',
      headers: { 'Authorization' : 'Bearer ' + userData.access_token },
      json: true,
    };
    const res = await new Promise((resolve, reject) => {
      request.delete(options, (err, res, body) => {
        err ? reject(err) : resolve('Removed (unfollowed) playlist.');
      });
    });
    await PlaylistModel.delete(id);
    return res;
  } catch (err) {
    console.log(err);
  }
}