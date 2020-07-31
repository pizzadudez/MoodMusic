// Used to test different services or model methods

const router = require('express').Router();
const TrackModel = require('../models/Track');
const PlaylistModel = require('../models/Playlist');
const LabelModel = require('../models/Label');
const TracksService = require('../services/tracks');
const PlaylistsService = require('../services/playlists');
const UserModel = require('../models/User');
const db = require('../../db');

router.get('/', async (req, res, next) => {
  try {
    let response;
    console.time('getTest');
    // =======================TEST CODE HERE=======================

    // ============================================================
    console.timeEnd('getTest');
    console.log(response);
    res.send(response || 'ok');
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post('/', (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
