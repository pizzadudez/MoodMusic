const TrackModel = require('../models/Track');

exports.getAllTracks = async (req, res, next) => {
  try {
    const tracks = await TrackModel.getAll();
    res.status(200).json(tracks);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.refreshTracks = async (req, res, next) => {};

exports.removeTrack = async (req, res, next) => {};
exports.rateTrack = async (req, res, next) => {};
exports.likeTrack = async (req, res, next) => {};
exports.refreshTracks = async (req, res, next) => {};
