// Used to test different services or model methods

const router = require('express').Router();
const LabelModel1 = require('../models/Label');
const LabelModel = require('../models/knex/Label');
const TrackModel1 = require('../models/Track');
const TrackModel = require('../models/knex/Track');
const PlaylistModel1 = require('../models/Playlist');
const PlaylistModel = require('../models/knex/Playlist');
const TracksService = require('../services/tracks');
const UserModel = require('../models/knex/User');
const db = require('../../db/knex');

router.get('/', async (req, res, next) => {
  try {
    let response = 'ok';
    console.time('getTest');
    // =======================TEST CODE HERE=======================
    // const data = [
    //   { id: 17, color: '#123123', verbose: 'test2' },
    //   { id: 19, color: '#123123', verbose: 'test2' },
    //   { id: 22, color: '#123123', verbose: 'test2' },
    // ];
    // const customUpdateSet = `"color" = "tmp"."color",
    //   "verbose" = "labels"."verbose" || "tmp"."verbose"`;
    // await db('labels').bulkUpdate(data, undefined, customUpdateSet);

    const data = [
      {
        id: '0UgkVNe1k74eWQwaudS8Ob',
        snapshot_id: 'abcd',
        track_count_delta: 1,
      },
    ];
    await PlaylistModel.updateMany(data);

    // ============================================================
    console.timeEnd('getTest');
    res.send(response);
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
