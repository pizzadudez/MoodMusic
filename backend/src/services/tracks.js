const { default: axios } = require('axios');
const request = require('request-promise-native');
const UserModel = require('../models/knex/User');
const PlaylistModel = require('../models/knex/Playlist');
const TrackModel = require('../models/Track');
const TrackModel2 = require('../models/knex/Track');

/**
 * Refresh or sync user's tracks:
 * - liked tracks (refresh: latest 50 only)
 * - tracks from playlists (mix/label)
 * @param {UserObj} userObj
 * @param {boolean=} sync - Do a hard sync instead of refresh
 */
exports.refreshTracks = async (userObj, sync = false) => {
  // Liked Tracks (last 50 / all)
  const likedTracks = await getLikedTracks(userObj, sync);
  await TrackModel2.addTracks(userObj.userId, likedTracks, true, sync);
  // Playlist Tracks (refresh: mix, sync: mix + label)
  const playlists = await refreshPlaylists(userObj, sync);
  if (playlists.length) {
    const trackRequests = playlists.map(({ id, track_count }) =>
      exports.getPlaylistTracks(userObj, id, sync ? undefined : track_count)
    );
    const trackLists = await Promise.all(trackRequests);
    // Add Tracks
    await TrackModel2.addTracks(userObj.userId, trackLists.flat(), sync);
    // Add Playlist-Track associations
    const playlistTracksList = playlists.map(({ id }, idx) => ({
      playlist_id: id,
      tracks: trackLists[idx],
    }));
    await PlaylistModel.addPlaylists(userObj.userId, playlistTracksList, sync);
  }
  // Update timestamps
  // TODO: more elegant
  await UserModel.update(userObj.userId, {
    [sync ? 'synced_at' : 'refreshed_at']: true,
  });
};
/**
 * Get playlist tracks from Spotify
 * @param {UserObj} userObj
 * @param {string} id - playlistId
 * @param {number=} trackCount - Get only latest 100 tracks
 */
exports.getPlaylistTracks = async (userObj, id, trackCount = undefined) => {
  const baseUrl = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=`;
  const config = {
    headers: {
      Authorization: 'Bearer ' + userObj.accessToken,
    },
  };
  // Get last 100 tracks only if trackCount is provided
  const firstOffset = trackCount > 100 ? trackCount - 100 : 0;
  const {
    data: { items: tracks, total: resTrackCount },
  } = await axios.get(baseUrl + firstOffset, config);
  // Concurrently request rest of tracks
  let otherTracks = [];
  if (!trackCount) {
    const requests = [];
    for (let offset = 1; offset <= resTrackCount / 100; offset++) {
      requests.push(axios.get(baseUrl + offset * 100, config));
    }
    const responses = await Promise.all(requests);
    otherTracks = responses.map(res => res.data.items).flat();
  }

  return parseTracks([...tracks, ...otherTracks]);
};
// TODO
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
/**
 * Get liked tracks from Spotify
 * @param {UserObj} userObj
 * @param {boolean=} sync - When true will fetch all Liked Songs
 */
const getLikedTracks = async (userObj, sync = false) => {
  const baseUrl = 'https://api.spotify.com/v1/me/tracks?limit=50';
  const config = {
    headers: {
      Authorization: 'Bearer ' + userObj.accessToken,
    },
  };
  // Get latest 50 liked tracks and total count
  const {
    data: { items: latestTracks, total: trackCount },
  } = await axios.get(baseUrl, config);
  // Concurrently request rest of tracks
  let otherTracks = [];
  if (sync) {
    const requests = [];
    for (let offset = 1; offset <= trackCount / 50; offset++) {
      requests.push(axios.get(baseUrl + `&offset=${offset * 50}`, config));
    }
    const responses = await Promise.all(requests);
    otherTracks = responses.map(res => res.data.items).flat();
  }

  return parseTracks([...latestTracks, ...otherTracks]);
};
/**
 * - Get up to date playlists from Spotify
 * - Return list of playlists to be refreshed/synced.
 * @param {UserObj} userObj
 * @param {*} sync - Return all playlist ids (except untracked/deleted)
 * @returns {Promise<{id: string, track_count: number}[]>}
 */
const refreshPlaylists = async (userObj, sync = false) => {
  const baseUrl = 'https://api.spotify.com/v1/me/playlists?limit=50';
  const config = {
    headers: {
      Authorization: 'Bearer ' + userObj.accessToken,
    },
  };
  // Get first batch of playlists and total count
  const {
    data: { items: playlists, total: playlistCount },
  } = await axios.get(baseUrl, config);
  // Concurrently request rest of playlists
  let otherPlaylists = [];
  if (playlistCount > 50) {
    const requests = [];
    for (let offset = 1; offset <= playlistCount / 50; offset++) {
      requests.push(axios.get(baseUrl + `&offset=${offset * 50}`, config));
    }
    const responses = await Promise.all(requests);
    otherPlaylists = responses.map(res => res.data.items).flat();
  }
  // Parse, update and return ids with changes
  const parsedPlaylists = parsePlaylists(
    [...playlists, ...otherPlaylists],
    userObj.userId
  );

  return PlaylistModel.refresh(userObj.userId, parsedPlaylists, sync);
};

// Spotify response items data parsers
/**
 * Parse a list of Spotify TrackObjects
 * @param {{added_at: string, track: object}[]} spotifyTracks
 * @returns {ParsedTrack[]}
 */
const parseTracks = spotifyTracks => {
  return spotifyTracks.map(({ added_at, track }) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    album_id: track.album.id,
    added_at,
    album: {
      id: track.album.id,
      name: track.album.name,
      small: track.album.images[0].url,
      medium: track.album.images[1].url,
      large: track.album.images[2].url,
    },
  }));
};
/**
 * Parse a list of Spotify PlaylistObjects
 * @param {object[]} spotifyPlaylists
 * @param {string} userId
 * @returns {ParsedPlaylist[]}
 */
const parsePlaylists = (spotifyPlaylists, userId) => {
  return spotifyPlaylists.map(obj => ({
    id: obj.id,
    name: obj.name,
    description: obj.description,
    snapshot_id: obj.snapshot_id,
    track_count: obj.tracks.total,
    user_id: userId,
  }));
};
