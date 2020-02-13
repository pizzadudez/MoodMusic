const PlaylistModel = require('../models/Playlist');
const PlaylistsService = require('../services/playlists');

exports.getAll = async (req, res, next) => {
  try {
    const playlistsById = await PlaylistModel.getAllById();
    res.status(200).json(playlistsById);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.addPlaylists = async (req, res, next) => {
  try {
    await PlaylistsService.addTracks(req.body);
    res.status(201).send('Tracks added to playlists.');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.removePlaylists = async (req, res, next) => {
  try {
    await PlaylistsService.removeTracks(req.body);
    res.status(201).send('Tracks removed from playlists.');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};

exports.create = async (req, res, next) => {};
exports.update = async (req, res, next) => {};
exports.delete = async (req, res, next) => {};
exports.reorderTracks = async (req, res, next) => {};
