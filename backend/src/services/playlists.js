const request = require('request-promise-native');
const UserModel = require('../models/User');
const PlaylistModel = require('../models/Playlist');
const TrackModel = require('../models/Track');
const LabelModel = require('../models/Label');
const TracksService = require('./tracks');

exports.addTracks = async data => {
  const requests = data.map(playlistTracks =>
    addPlaylistTracks(playlistTracks)
  );
  const responses = await Promise.all(requests);
  await PlaylistModel.addPlaylists(data);

  const playlistsUpdates = responses
    .filter(([snapshotId]) => snapshotId !== undefined)
    .map(([snapshotId, newTrackCount], idx) => ({
      id: data[idx].playlist_id,
      snapshot_id: snapshotId,
      track_count: newTrackCount,
    }));
  await PlaylistModel.updateMany(playlistsUpdates);
};
exports.removeTracks = async data => {
  const requests = data.map(playlistTracks =>
    removePlaylistTracks(playlistTracks)
  );
  const responses = await Promise.all(requests);
  await PlaylistModel.removePlaylists(data);

  const playlistsUpdates = responses
    .filter(([snapshotId]) => snapshotId !== undefined)
    .map(([snapshotId, newTrackCount], idx) => ({
      id: data[idx].playlist_id,
      snapshot_id: snapshotId,
      track_count: newTrackCount,
    }));
  await PlaylistModel.updateMany(playlistsUpdates);
};

// TODO: Handle label_id assoc (add tracks with that label to playlist)
exports.create = async data => {
  const { access_token: token, user_id: userId } = await UserModel.data();
  const response = await request.post({
    url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
    headers: { Authorization: 'Bearer ' + token },
    body: {
      name: data.name,
      description: data.description,
    },
    json: true,
  });

  const playlistData = {
    id: response.id,
    name: response.name,
    description: response.description,
    track_count: response.tracks.total,
    snapshot_id: response.snapshot_id,
    added_at: new Date().toISOString(),
    type: data.type,
    ...(data.type === 'label' && { label_id: data.label_id }),
  };

  // Add labelTracks to labelPlaylist
  if (data.type === 'label' && data.label_id) {
    const labelTracks = await LabelModel.getTracks(data.label_id);
    const playlistTracks = {
      playlist_id: response.id,
      track_ids: labelTracks,
    };
    if (labelTracks.length) {
      const [snapshotId, newTrackCount] = await addPlaylistTracks(
        playlistTracks
      );
      // Update data fields if we add tracks
      playlistData.snapshot_id = snapshotId;
      playlistData.track_count = newTrackCount;
    }
    const playlist = await PlaylistModel.create(playlistData);
    await PlaylistModel.addPlaylists([playlistTracks], true);
    return playlist;
  }

  return PlaylistModel.create(playlistData);
};
exports.update = async (id, data) => {
  const { access_token: token } = await UserModel.data();
  const { type, label_id } = await PlaylistModel.getOne(id);

  // Changing the playlist type comes with multiple side-effects
  switch (data.type) {
    case 'untracked': {
      if (type === 'label') {
        // Remove playlist-label assoc
        data.label_id = null;
      }
      // Remove playlist-tracks associations (but leave tracks)
      await PlaylistModel.removePlaylistTracks(id);
      break;
    }
    case 'mix': {
      const tracks = await TracksService.getPlaylistTracks(id, true);
      if (type === 'label') {
        // Remove playlist-label assoc
        data.label_id = null;
      }
      // sync/import
      await TrackModel.addTracks(tracks);
      await PlaylistModel.addPlaylists([{ playlist_id: id, tracks }], true);
      break;
    }
    case 'label': {
      const tracks = await TracksService.getPlaylistTracks(id, true);
      if (type === 'label' && data.label_id) {
        // Remove prev label from tracks and add new one
        await LabelModel.removeLabelTracks(label_id);
      }
      // sync/import
      await TrackModel.addTracks(tracks);
      await PlaylistModel.addPlaylists([{ playlist_id: id, tracks }], true);
      await LabelModel.addLabels([
        { label_id: data.label_id, track_ids: tracks.map(t => t.id) },
      ]);

      // Add all tracks with label_id (not in playlist) to playlist
      const labelTracks = await LabelModel.getTracks(data.label_id);
      if (labelTracks.length) {
        const newPlaylistTracks = {
          playlist_id: id,
          track_ids: labelTracks,
        };
        const [snapshotId, newTrackCount] = await addPlaylistTracks(
          newPlaylistTracks
        );
        data.snapshot_id = snapshotId;
        data.track_count = newTrackCount;
        await PlaylistModel.addPlaylists([newPlaylistTracks], true);
      }
      break;
    }
  }
  // Spotify request
  if (data.name || data.description) {
    await request.put({
      url: 'https://api.spotify.com/v1/playlists/' + id,
      headers: { Authorization: 'Bearer ' + token },
      body: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
      },
      json: true,
    });
  }
  return PlaylistModel.update(id, data);
};
exports.delete = async id => {
  const { access_token: token } = await UserModel.data();
  await request.delete({
    url: 'https://api.spotify.com/v1/playlists/' + id + '/followers',
    headers: { Authorization: 'Bearer ' + token },
    json: true,
  });
  await PlaylistModel.removePlaylistTracks(id);
  await PlaylistModel.updateMany([{ id, type: 'deleted', label_id: null }]);

  return PlaylistModel.getOne(id);
};
exports.restore = async id => {
  const { access_token: token } = await UserModel.data();
  await request.put({
    url: 'https://api.spotify.com/v1/playlists/' + id + '/followers',
    headers: { Authorization: 'Bearer ' + token },
    json: true,
  });
  await PlaylistModel.updateMany([{ id, type: 'untracked' }]);

  return PlaylistModel.getOne(id);
};

exports.syncTracks = async id => {
  const { type, label_id } = await PlaylistModel.getOne(id);
  const tracks = await TracksService.getPlaylistTracks(id, true);

  const associations = [
    {
      playlist_id: id,
      tracks,
      ...(label_id && {
        label_id: label_id,
        track_ids: tracks.map(t => t.id),
      }),
    },
  ];
  await TrackModel.addTracks(tracks);
  if (type !== 'untracked') {
    await PlaylistModel.addPlaylists(associations, true);
    if (type === 'label') {
      await LabelModel.removeLabelTracks(label_id);
      await LabelModel.addLabels(associations);
    }
  }
  await PlaylistModel.updateMany([{ id, updates: 0 }]);
  return PlaylistModel.getOne(id);
};
exports.revertTracks = async playlistId => {
  const { access_token: token } = await UserModel.data();
  const trackIds = await PlaylistModel.getTracks(playlistId);
  let uris = trackIds.map(id => 'spotify:track:' + id);

  let replace = true; // first 100 tracks use the replace endpoint
  let snapshotId;
  while (uris.length) {
    const batch = uris.splice(0, 100);
    const options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks',
      headers: { Authorization: 'Bearer ' + token },
      body: { uris: batch },
      json: true,
    };
    if (replace) {
      const response = await request.put(options);
      snapshotId = response.snapshot_id;
      replace = false;
    } else {
      const response = await request.post(options);
      snapshotId = response.snapshot_id;
    }
  }
  await PlaylistModel.updateMany([
    {
      id: playlistId,
      updates: 0,
      track_count: trackIds.length,
      snapshot_id: snapshotId,
    },
  ]);
  return PlaylistModel.getOne(playlistId);
};

// Helpers
const addPlaylistTracks = async ({ playlist_id, track_ids }) => {
  const { access_token: token } = await UserModel.data();
  const hashMap = await PlaylistModel.getTracks(playlist_id, true);
  let uris = track_ids
    .filter(id => !hashMap[id])
    .map(id => 'spotify:track:' + id);
  const newTrackCount = Object.keys(hashMap).length + uris.length;

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
  return [snapshotId, newTrackCount];
};
const removePlaylistTracks = async ({ playlist_id, track_ids }) => {
  const { access_token: token } = await UserModel.data();
  const hashMap = await PlaylistModel.getTracks(playlist_id, true);
  let uris = track_ids
    .filter(id => hashMap[id])
    .map(id => 'spotify:track:' + id);
  const newTrackCount = Object.keys(hashMap).length - uris.length;

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
  return [snapshotId, newTrackCount];
};
