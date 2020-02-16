const PlaylistModel = require('../models/Playlist');
const PlaylistsService = require('../services/playlists');
const TracksService = require('../services/tracks');

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

exports.create = async (req, res, next) => {
  try {
    const playlist = await PlaylistsService.createPlaylist(req.body);
    res.status(200).json(playlist);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.update = async (req, res, next) => {
  try {
    const playlist = await PlaylistsService.updatePlaylist(
      req.params.id,
      req.body
    );
    res.status(200).json(playlist);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.delete = async (req, res, next) => {
  try {
    await PlaylistsService.deletePlaylist(req.params.id);
    res.status(200).send('Successfully deleted.');
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.syncTracks = async (req, res, next) => {
  try {
    const tracksById = await PlaylistsService.syncTracks(req.params.id);
    res.status(200).json(tracksById);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.revertChanges = async (req, res, next) => {
  try {
    await PlaylistsService.revertChanges(req.params.id);
    res.status(200).send('Success.');
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.reorderTracks = async (req, res, next) => {};
