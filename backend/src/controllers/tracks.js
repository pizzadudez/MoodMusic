const TrackModel = require('../models/Track');
const TracksService = require('../services/tracks');

exports.getAll = async (req, res) => {
  try {
    const tracksById = await TrackModel.getAllById(req.user.userId);
    res.status(200).json(tracksById);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};
exports.refreshTracks = async (req, res) => {
  try {
    await Promise.all([
      TracksService.refreshLikedTracks(req.user),
      TracksService.refreshPlaylistTracks(req.user),
    ]);
    const tracks = await TrackModel.getAllById(req.user.userId);
    res.status(200).json({ message: 'refreshed', tracks });
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};
exports.syncTracks = async (req, res) => {
  try {
    await Promise.all([
      TracksService.refreshLikedTracks(req.user, true),
      TracksService.refreshPlaylistTracks(req.user, true),
    ]);
    const tracks = await TrackModel.getAllById(req.user.userId);
    res.status(200).json({ message: 'synced', tracks });
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};

exports.toggleLike = async (req, res) => {
  try {
    await TracksService.toggleLike(req.user, req.params.id, req.body.toggle);
    res.sendStatus(200);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};
exports.rate = async (req, res) => {};
exports.delete = async (req, res) => {};
