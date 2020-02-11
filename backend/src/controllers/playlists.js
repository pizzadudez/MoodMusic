const PlaylistModel = require('../models/Playlist');

exports.getAll = async (req, res, next) => {
  try {
    const playlists = await PlaylistModel.getAll();
    res.status(200).json(playlists);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.addPlaylists = async (req, res, next) => {
  try {
    await PlaylistModel.addPlaylists(req.body);
    res.status(201).send('Associations added.');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.removePlaylists = async (req, res, next) => {
  try {
    await PlaylistModel.removePlaylists(req.body);
    res.status(201).send('Associations removed.');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
// TODO
exports.refreshPlaylists = async (req, res, next) => {};

exports.create = async (req, res, next) => {};
exports.update = async (req, res, next) => {};
exports.delete = async (req, res, next) => {};
exports.reorderTracks = async (req, res, next) => {};
