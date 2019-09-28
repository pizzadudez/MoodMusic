const request = require('request');
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
// TODO finish
// Update tracks from tracked playlists with changes
exports.refreshTracks = async () => {
  try {
    const playlistsIds = await PlaylistModel.trackedWithChanges();
    if (!playlists.length) { return 'No tracked playlists have changes.'; }
    const userData = await UserModel.getUser();
    const filters = '?fields=items(track(id,name,artists,album),added_at)';
    
    const promises = playlistsIds.map(id => {
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
    const playlistsTracks = await Promise.all(promises);

    const trackHashMap = await TrackModel.hashMap();
    const preparedTracks = playlistsTracks.reduce((arr, pl) => {
      const tracks = pl.tracks.reduce((arr, track) => {
        if (trackHashMap[track.id]) {
          return arr;
        } else {
          return [...arr, track];
        }
      }, []);
      return [...arr, ...tracks];
    }, []);
    console.log(preparedTracks);

    const rel = playlistsTracks.map(playlist => ({
      playlist_id: playlist.playlist_id,
      track_ids: playlist.tracks.map(track => track.id)
    }));
    console.log(rel)

  } catch (err) {
    console.log(err);
  }
};
// README
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