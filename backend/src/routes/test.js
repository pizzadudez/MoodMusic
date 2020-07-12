// Used to test different services or model methods

const router = require('express').Router();
const LabelModel = require('../models/Label');
const TrackModel = require('../models/Track');
const PlaylistModel = require('../models/Playlist');
const TracksService = require('../services/tracks');

router.get('/', async (req, res, next) => {
  try {
    // const test = await TracksService.refreshTracks(req.user);
    // res.status(200).json(test);
    res.send('ok');
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
});
router.post('/', (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
