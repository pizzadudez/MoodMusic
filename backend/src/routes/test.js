// Used to test different services or model methods

const router = require('express').Router();
const LabelModel1 = require('../models/Label');
const LabelModel = require('../models/knex/Label');
const TrackModel1 = require('../models/Track');
const TrackModel = require('../models/knex/Track');
const PlaylistModel = require('../models/Playlist');
const TracksService = require('../services/tracks');
const UserModel = require('../models/knex/User');
const db = require('../../db/knex');

router.get('/', async (req, res, next) => {
  try {
    console.time('getTest');
    // const test = await TracksService.refreshTracks(req.user);
    // res.status(200).json(test);

    // const id = '5lZhmODcfCJBMRIP0Ju5Gh';
    // const trackCount = 138;
    // const tracks = await TracksService.getPlaylistTracks(
    //   req.user,
    //   id,
    //   trackCount
    // );
    // const test = tracks.map(track => track.name);
    // res.json(test);

    // const test = await TrackModel1.getAll();
    // const test = await TrackModel.getAllById(req.user.userId);
    // const test = await LabelModel.getAllById(req.user.userId);
    await TrackModel.update(req.user.userId, '123', { rating: 5 });
    console.timeEnd('getTest');
    res.send(test);
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
