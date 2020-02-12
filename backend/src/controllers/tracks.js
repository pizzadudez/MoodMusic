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
// TODO get new tracks with as few requests as possible
exports.refreshTracks = async (req, res, next) => {
  try {
    const test = await TracksService.refreshTracks();
    res.status(200).json(test);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// TODO get all tracks from playlists/liked and sync all associations
exports.syncTracks = async (req, res, next) => {};

exports.delete = async (req, res, next) => {};
exports.rate = async (req, res, next) => {};
exports.like = async (req, res, next) => {};
