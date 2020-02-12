const request = require('request-promise-native');
const UserModel = require('../models/User');
const PlaylistModel = require('../models/Playlist');

exports.addTracks = async data => {
  const requests = data.map(playlistTracks =>
    addPlaylistTracks(playlistTracks)
  );
  const responses = await Promise.all(requests);
  await PlaylistModel.addPlaylists(data);

  const playlistsUpdates = responses.map(([snapshotId, newTracksNum], idx) => ({
    playlist_id: data[idx].playlist_id,
    snapshot_id: snapshotId,
    tracks_num: newTracksNum,
  }));
  await PlaylistModel.updateChanges(playlistsUpdates);
};
exports.removeTracks = async data => {
  const requests = data.map(playlistTracks =>
    removePlaylistTracks(playlistTracks)
  );
  const responses = await Promise.all(requests);
  await PlaylistModel.removePlaylists(data);

  const playlistsUpdates = responses.map(([snapshotId, newTracksNum], idx) => ({
    playlist_id: data[idx].playlist_id,
    snapshot_id: snapshotId,
    tracks_num: newTracksNum,
  }));
  await PlaylistModel.updateChanges(playlistsUpdates);
};

const addPlaylistTracks = async ({ playlist_id, track_ids }) => {
  const { access_token: token } = await UserModel.data();
  const hashMap = await PlaylistModel.tracksHashMap(playlist_id);
  let uris = track_ids
    .filter(id => !hashMap[id])
    .map(id => 'spotify:track:' + id);
  const newTracksNum = Object.keys(hashMap).length + uris.length;

  // 100 tracks per request
  let snapshotId;
  while (uris.length) {
    const batch = uris.splice(0, 100);
    const response = await request.post({
      url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks',
      headers: { Authorization: 'Bearer ' + token },
      body: { uris: batch },
      json: true,
    });
    snapshotId = response.snapshot_id;
  }
  return [snapshotId, newTracksNum];
};
const removePlaylistTracks = async ({ playlist_id, track_ids }) => {
  const { access_token: token } = await UserModel.data();
  const hashMap = await PlaylistModel.tracksHashMap(playlist_id);
  let uris = track_ids
    .filter(id => hashMap[id])
    .map(id => 'spotify:track:' + id);
  const newTracksNum = Object.keys(hashMap).length - uris.length;

  // 100 tracks per request
  let snapshotId;
  while (uris.length) {
    const batch = uris.splice(0, 100);
    const response = await request.delete({
      url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks',
      headers: { Authorization: 'Bearer ' + token },
      body: { uris: batch },
      json: true,
    });
    snapshotId = response.snapshot_id;
  }
  return [snapshotId, newTracksNum];
};
