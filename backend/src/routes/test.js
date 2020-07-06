// Used to test different services or model methods

const router = require('express').Router();
const LabelModel = require('../models/Label');
const TrackModel = require('../models/Track');
const PlaylistModel = require('../models/Playlist');

router.get('/', async (req, res, next) => {
  try {
    test = await TrackModel.getAllById();
    res.status(200).json(test);
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
