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
    const id = '5lZhmODcfCJBMRIP0Ju5Gh';
    const trackCount = 138;
    const tracks = await TracksService.getPlaylistTracks(
      req.user,
      id,
      trackCount
    );
    const test = tracks.map(track => track.name);
    res.json(test);
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
