const TrackModel = require('../models/Track');
const TracksService = require('../services/tracks');

exports.getAll = async (req, res, next) => {
  try {
    const tracks = await TrackModel.getAll();
    res.status(200).json(tracks);
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

exports.delete = async (req, res, next) => {};
exports.rate = async (req, res, next) => {};
exports.like = async (req, res, next) => {};
