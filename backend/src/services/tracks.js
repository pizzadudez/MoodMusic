const request = require('request-promise-native');
const UserModel = require('../models/knex/User');
const PlaylistModel = require('../models/Playlist');
const TrackModel = require('../models/Track');
const TrackModel2 = require('../models/knex/Track');

/**
 * Refresh tracks descriptionsdfsdfsssssssssssssssssssssssssssssssssssssssssssssssssssssss
 * @param {{accessToken: string, userId: string}} userObj
 * @param {boolean} sync wether to hard reset or soft refresh
 */
exports.refreshTracks = async (userObj, sync = false) => {
  // Liked Tracks (last 50 / all)
  const likedTracks = await getLikedTracks(userObj, sync);
  await TrackModel.addTracks(likedTracks, true, sync);
  await TrackModel2.addTracks(userObj, likedTracks, true, sync);
  // Playlist Tracks (refresh: mix, sync: mix + label)
  const playlists = await refreshPlaylists(userObj, sync);
  if (playlists.length) {
    const requests = playlists.map(({ id, track_count }) =>
      exports.getPlaylistTracks(userObj, id, sync, track_count)
    );
    const responses = await Promise.all(requests);
    const playlistTracks = playlists.map(({ id }, idx) => ({
      playlist_id: id,
      tracks: responses[idx],
    }));
    // Add Tracks and PlaylistTracks
    await TrackModel.addTracks(responses.flat(Infinity));
    await TrackModel2.addTracks(userObj, responses.flat(Infinity));
    await PlaylistModel.addPlaylists(playlistTracks, sync);
    await PlaylistModel.updateMany(
      playlists.map(pl => ({ id: pl.id, updates: 0 }))
    );
  }
  // Update timestamps
  await UserModel.update(userObj.userId, {
    [sync ? 'synced_at' : 'refreshed_at']: new Date().toISOString(),
  });

  return {
    message: `Track ${sync ? 'sync' : 'refresh'} complete!`,
    tracks: await TrackModel.getAllById(),
  };
};

exports.getPlaylistTracks = async (userObj, id, sync = false, track_count) => {
  const response = await request.get({
    url:
      'https://api.spotify.com/v1/playlists/' +
      id +
      '/tracks' +
      (!sync ? '?offset=' + (track_count > 100 ? track_count - 100 : 0) : ''),
    headers: { Authorization: 'Bearer ' + userObj.accessToken },
    json: true,
  });
  const totalTracks = response.total;

  if (!sync) {
    return parseTracks(response.items);
  } else {
    const requests = [];
    for (let offset = 1; offset <= totalTracks / 50; offset++) {
      const req = async () => {
        const response = await request.get({
          url:
            'https://api.spotify.com/v1/playlists/' +
            id +
            '/tracks?offset=' +
            offset * 100,
          headers: { Authorization: 'Bearer ' + userObj.accessToken },
          json: true,
        });
        return response.items;
      };
      requests.push(req());
    }
    const otherTracks = (await Promise.all(requests)).flat(Infinity);
    return parseTracks([...response.items, ...otherTracks]);
  }
};
exports.toggleLike = async (userObj, id, toggle = true) => {
  await request[toggle ? 'put' : 'delete']({
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: { Authorization: 'Bearer ' + userObj.accessToken },
    body: { ids: [id] },
    json: true,
  });
  await TrackModel.update(id, { liked: toggle });
};

// Helpers

const getLikedTracks = async (userObj, sync = false) => {
  const response = await request.get({
    url: 'https://api.spotify.com/v1/me/tracks?limit=50',
    headers: { Authorization: 'Bearer ' + userObj.accessToken },
    json: true,
  });

  if (!sync) {
    // Get only first 50 tracks
    return parseTracks(response.items);
  } else {
    // Get all liked tracks (parallel requests)
    const totalTracks = response.total;
    const requests = [];
    for (let offset = 1; offset <= totalTracks / 50; offset++) {
      const req = async () => {
        const response = await request.get({
          url:
            'https://api.spotify.com/v1/me/tracks?limit=50&offset=' +
            offset * 50,
          headers: { Authorization: 'Bearer ' + userObj.accessToken },
          json: true,
        });
        return response.items;
      };
      requests.push(req());
    }
    const otherTracks = (await Promise.all(requests)).flat(Infinity);
    return parseTracks([...response.items, ...otherTracks]);
  }
};
/**
 * Comment JSDoc
 */
const refreshPlaylists = async (userObj, sync = false) => {
  const response = await request.get({
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { Authorization: 'Bearer ' + userObj.accessToken },
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
          headers: { Authorization: 'Bearer ' + userObj.accessToken },
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

// Data Parsers
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
    description: obj.description,
    snapshot_id: obj.snapshot_id,
    track_count: obj.tracks.total,
  }));
};
