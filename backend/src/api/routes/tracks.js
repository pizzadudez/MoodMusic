const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../../services/validator');
const SpotifyService = require('../../services/spotify');
const TrackModel = require('../../models/Track');

//
router.get('/', async (req, res, next) => {
  const message = await TrackModel.getAll();
  res.send(message);
});
//
router.get('/check', async (req, res, next) => {
  await SpotifyService.refreshPlaylists();
  const message = await SpotifyService.refreshTracks();
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