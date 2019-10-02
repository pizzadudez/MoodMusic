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
        const error = err || res.statusCode >= 400 ? body : null;
        if (error) {
          reject(error);
        } else {
          const response = body.items.map(pl => ({
            'name': pl.name,
            'id': pl.id,
            'snapshot_id': pl.snapshot_id
          }));
          resolve(response);
        }
      });
    });
    await PlaylistModel.update(playlists);
    return 'Tracked Playlists checked';
  } catch (err) {
    console.log("Playlist refresh error: " + err.error.message);
    return Promise.reject(err);
  }
};
// Get new Tracks from tracked playlists with changes
exports.refreshTracks = async () => {
  try {
    const playlistIds = await PlaylistModel.trackedWithChanges();
    if (!playlistIds.length) { return 'No tracked playlists have changes.'; }
    const token = (await UserModel.getUser()).access_token;
    const playlistPromises = playlistIds.map(id => getPlaylistTracks(id, token));
    const playlistTracks = await Promise.all(playlistPromises);

    // tracks
    const allTracks = playlistTracks.reduce((arr, pl) => [...arr, ...pl.tracks], []);
    await TrackModel.newTracks(allTracks);
    // tracks-playlists relationships
    const tp = playlistTracks.map(pl => ({
      playlist_id: pl.playlist_id,
      track_ids: pl.tracks.map(t => t.id)
    }));
    await TrackModel.addTracks(tp);
    // tracks-labels relationships
    const labelPromises = playlistTracks.map(async pl => {
      const genreId = (await PlaylistModel.get(pl.playlist_id)).genre_id;
      if (!genreId) return []; 
      const list = pl.tracks.map(track => ({
        track_id: track.id,
        label_ids: [genreId]
      }));
      return list
    });
    const tl = (await Promise.all(labelPromises)).flat(Infinity);
    await LabelModel.addLabels(tl);

    // Set the changes field to false on checked playlists
    playlistIds.forEach(id => PlaylistModel.setChanges(id, 0));
    return 'New Tracks Added!';
  } catch (err) {
    console.log("Tracks refresh error: " + err)
    return Promise.reject(err);
  }
};

// Create Playlist
exports.createPlaylist = async name => {
  try {
    const userData = await UserModel.getUser();
    const options = {
      url: 'https://api.spotify.com/v1/users/' + userData.user_id + '/playlists',
      headers: { 'Authorization' : 'Bearer ' + userData.access_token },
      body: { 'name': name },
      json: true,
    };
    const res = await new Promise((resolve, reject) => {
      request.post(options, (err, res, body) => {
        const error = err || res.statusCode >= 400 ? body : null;
        error ? reject(error) : resolve(body);
      });
    });
    const playlist = {
      id: res.id,
      name: res.name,
      snapshot_id: res.snapshot_id
    }
    await PlaylistModel.create(playlist);
    return ({
      message: 'Successfully created new Playlist!',
      playlist: playlist
    });
  } catch (err) {
    console.log("Request error: " + err.error.message);
    return err;
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
    const response = await new Promise((resolve, reject) => {
      request.delete(options, (err, res, body) => {
        const error = err || res.statusCode >= 400 ? body : null;
        error ? reject(error) : resolve('Removed (unfollowed) playlist.');
      });
    });
    await PlaylistModel.delete(id);
    return response;
  } catch (err) {
    console.log("Request error: " + err.error.message);
    return err;
  }
};

// Add Tracks to Spotify playlist
exports.addTracks = async playlistsTracks => {
  try {
    const token = (await UserModel.getUser()).access_token;
    const requests = playlistsTracks.map(pl => {
      return new Promise((resolve, reject) => {
        const uris = pl.track_ids.map(id => "spotify:track:" + id);
        const options = {
          url: 'https://api.spotify.com/v1/playlists/' + pl.playlist_id + '/tracks',
          headers: { 'Authorization' : 'Bearer ' + token },
          body: { 'uris': uris },
          json: true,
        };
        request.post(options, (err, res, body) => {
          const error = err || res.statusCode >= 400 ? body : null;
          error ? reject(error) : resolve();
        });
      });
    });
    await Promise.all(requests);
  } catch (err) {
    console.log(err.error.message);
    return Promise.reject(err);
  }
};
// Remove Tracks from Spotify Playlist
exports.removeTracks = async playlistsTracks => {
  try {
    const token = (await UserModel.getUser()).access_token;
    const requests = playlistsTracks.map(pl => {
      return new Promise((resolve, reject) => {
        const uris = pl.track_ids.map(id => "spotify:track:" + id);
        const options = {
          url: 'https://api.spotify.com/v1/playlists/' + pl.playlist_id + '/tracks',
          headers: { 'Authorization' : 'Bearer ' + token },
          body: { 'uris': uris },
          json: true,
        };
        request.delete(options, (err, res, body) => {
          const error = err || res.statusCode >= 400 ? body : null;
          error ? reject(error) : resolve();
        });
      });
    });
    await Promise.all(requests);
  } catch (err) {
    console.log(err.error.message);
    return Promise.reject(err);
  }
};

/* Helper functions */
// Get all new Tracks from a playlist
const getPlaylistTracks = (id, token, nextUrl, allTracks = []) => {
  const filters = '?fields=next,items(track(id,name,artists,album),added_at)';
  const options = {
    url: nextUrl 
      ? nextUrl 
      : 'https://api.spotify.com/v1/playlists/' + id + '/tracks' + filters,
    headers: { 'Authorization': 'Bearer ' + token },
    json: true,
  };
  return new Promise((resolve, reject) => {
    request.get(options, async (err, res, body) => {
      if (err) { reject (err); }
      const tracks = body.items.reduce((arr, obj) => {
        const track = {
          'id': obj.track.id,
          'name': obj.track.name,
          'artist': obj.track.artists[0].name,
          'album': obj.track.album.name,
          'added_at': obj.added_at,
        };
        return [...arr, track];
      }, []);
      allTracks = [...allTracks, ...tracks];
      body.next
        ? resolve(getPlaylistTracks(id, token, body.next, allTracks))
        : resolve({
          playlist_id: id,
          tracks: allTracks
        });
    });
  });
};