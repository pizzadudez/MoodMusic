const TrackModel = require('../models/Track');

exports.getAll = async (req, res, next) => {
  try {
    const tracks = await TrackModel.getAll();
    res.status(200).json(tracks);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
// TODO
exports.refreshTracks = async (req, res, next) => {};

exports.delete = async (req, res, next) => {};
exports.rate = async (req, res, next) => {};
exports.like = async (req, res, next) => {};
