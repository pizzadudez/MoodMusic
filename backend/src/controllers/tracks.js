const TrackModel = require('../models/Track');
const TracksService = require('../services/tracks');

exports.getAll = async (req, res, next) => {
  try {
    const tracksById = await TrackModel.getAllById();
    res.status(200).json(tracksById);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.refreshTracks = async (req, res, next) => {
  try {
    const updates = await TracksService.refreshTracks();
    res.status(200).json(updates);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.syncTracks = async (req, res, next) => {
  try {
    const updates = await TracksService.refreshTracks(true);
    res.status(200).json(updates);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    await TracksService.toggleLike(req.params.id, req.body.toggle);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.rate = async (req, res, next) => {};
exports.delete = async (req, res, next) => {};
