const request = require('request-promise-native');
const UserModel = require('../models/User');
const PlaylistModel = require('../models/Playlist');
const TrackModel = require('../models/Track');
const LabelModel = require('../models/Label');

exports.refreshTracks = async (sync = false) => {
  // Liked Tracks (last 50 / all)
  const likedTracks = await getLikedTracks(sync);
  await TrackModel.addTracks(likedTracks, true);
  // Playlist Tracks (tracked+changes / tracked)
  const playlists = await refreshPlaylists(sync);
  const requests = playlists.map(({ id, tracks_num }) =>
    getPlaylistTracks(id, sync, tracks_num)
  );
  const responses = await Promise.all(requests);
  const playlistTracks = playlists.map(({ id }, idx) => ({
    playlist_id: id,
    tracks: responses[idx],
  }));
  // Add Tracks and PlaylistTracks
  await TrackModel.addTracks(responses.flat(Infinity));
  await PlaylistModel.addPlaylists(playlistTracks, sync);
  // Update User and Playlists
  await PlaylistModel.setNoChanges(playlists);
  await UserModel.updateUser(sync ? 'sync' : 'refresh');

  return {
    message: `Track ${sync ? 'sync' : 'refresh'} complete!`,
    tracks: await TrackModel.getAll(),
    playlists: await PlaylistModel.getAll(),
  };
};

// Helpers
const getLikedTracks = async (sync = false) => {
  const { access_token: token } = await UserModel.data();
  const response = await request.get({
    url: 'https://api.spotify.com/v1/me/tracks?limit=50',
    headers: { Authorization: 'Bearer ' + token },
    json: true,
  });

  if (sync) {
    // Get all liked tracks (parallel requests)
    const totalTracks = response.total;
    const requests = [];
    for (let offset = 1; offset <= totalTracks / 50; offset++) {
      const req = async () => {
        const response = await request.get({
          url:
            'https://api.spotify.com/v1/me/tracks?limit=50&offset=' +
            offset * 50,
          headers: { Authorization: 'Bearer ' + token },
          json: true,
        });
        return response.items;
      };
      requests.push(req());
    }
    const otherTracks = (await Promise.all(requests)).flat(Infinity);
    return parseTracks([...response.items, ...otherTracks]);
  } else {
    // Get only first 50 tracks
    return parseTracks(response.items);
  }
};
const refreshPlaylists = async (sync = false) => {
  const { access_token: token } = await UserModel.data();
  const response = await request.get({
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { Authorization: 'Bearer ' + token },
    json: true,
  });
  const totalPlaylists = response.total;

  if (totalPlaylists <= 50) {
    return PlaylistModel.refresh(parsePlaylists(response.items), sync);
  } else {
    const requests = [];
    for (let offset = 1; offset <= totalPlaylists / 50; offset++) {
      const req = async () => {
        const response = await request.get({
          url:
            'https://api.spotify.com/v1/me/playlists?limit=50&offset=' +
            offset * 50,
          headers: { Authorization: 'Bearer ' + token },
          json: true,
        });
        return response.items;
      };
      requests.push(req());
    }
    const otherPlaylists = (await Promise.all(requests)).flat(Infinity);
    return PlaylistModel.refresh(
      parsePlaylists([...response.items, ...otherPlaylists]),
      sync
    );
  }
};
const getPlaylistTracks = async (id, sync = false, tracks_num) => {
  const { access_token: token } = await UserModel.data();
  const response = await request.get({
    url:
      'https://api.spotify.com/v1/playlists/' +
      id +
      '/tracks' +
      (!sync ? '?offset=' + (tracks_num > 100 ? tracks_num - 100 : 0) : ''),
    headers: { Authorization: 'Bearer ' + token },
    json: true,
  });
  const totalTracks = response.total;

  if (sync) {
    const requests = [];
    for (let offset = 1; offset <= totalTracks / 50; offset++) {
      const req = async () => {
        const response = await request.get({
          url:
            'https://api.spotify.com/v1/playlists/' +
            id +
            '/tracks?offset=' +
            offset * 100,
          headers: { Authorization: 'Bearer ' + token },
          json: true,
        });
        return response.items;
      };
      requests.push(req());
    }
    const otherTracks = (await Promise.all(requests)).flat(Infinity);
    return parseTracks([...response.items, ...otherTracks]);
  } else {
    return parseTracks(response.items);
  }
};

// Data Parsing
const parseTracks = list => {
  return list.map(obj => ({
    id: obj.track.id,
    name: obj.track.name,
    artist: obj.track.artists[0].name,
    album_id: obj.track.album.id,
    added_at: obj.added_at,
    album: {
      id: obj.track.album.id,
      name: obj.track.album.name,
      images: obj.track.album.images.map(size => size.url),
    },
  }));
};
const parsePlaylists = list => {
  return list.map(obj => ({
    id: obj.id,
    name: obj.name,
    snapshot_id: obj.snapshot_id,
    tracks_num: obj.tracks.total,
  }));
};