const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../../services/validator');
const SpotifyService = require('../../services/spotify');
const TrackModel = require('../../models/Track');
const TracksService = require('../../services/tracks');

router.get('/', async (req, res, next) => {
  try {
    await SpotifyService.refreshPlaylists();
    const message = await SpotifyService.refreshTracks();
    res.send(message);
  } catch (err) {
    res.send(err);
  }
});
//
router.get('/test', async (req, res, next) => {
  const message = await TracksService.addNewTracks()
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  res.send(message);
});
//
router.post('/add', validator('addTracks'), async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const message = await TrackModel.addTracks(req.body)
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  res.send(message);
});
//
router.post('/remove', validator('addTracks'), async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const message = await TrackModel.removeTracks(req.body)
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  res.send(message);
});

module.exports = router;