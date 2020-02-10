const PlaylistModel = require('../models/Playlist');

exports.getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await PlaylistModel.getAll();
    res.status(200).json(playlists);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.refreshPlaylists = async (req, res, next) => {};
exports.addPlaylists = async (req, res, next) => {};
exports.removePlaylists = async (req, res, next) => {};

exports.createPlaylist = async (req, res, next) => {};
exports.updatePlaylist = async (req, res, next) => {};
exports.deletePlaylist = async (req, res, next) => {};
exports.reorderPlaylistTracks = async (req, res, next) => {};
