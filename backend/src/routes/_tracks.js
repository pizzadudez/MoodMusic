const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../_services/validator');
const SpotifyService = require('../_services/spotify');
const TracksService = require('../_services/tracks');
const TrackModel = require('../_models/Track');

const validate = require('../middlewares/validate');

router.get('/test', validate('test'), (req, res, next) => {
  res.status(200).json(req.body);
});

// Get all track objects (full)
router.get('/', async (req, res, next) => {
  try {
    const tracksById = await TrackModel.getAll();
    res.status(200).json(tracksById);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error.');
  }
});
// Add new tracks or playlist tracks relations
router.get('/check', async (req, res, next) => {
  try {
    await TracksService.syncLikedSongs();
    await SpotifyService.refreshPlaylists();
    const response = await SpotifyService.refreshTracks();
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
});
// Add Tracks to Playlists
router.post('/add', validator('addTracks'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    await SpotifyService.removeTracks(req.body);
    await SpotifyService.addTracks(req.body);
    await TrackModel.removeTracks(req.body);
    await TrackModel.addTracks(req.body);
    res.send('Tracks added to their coresponding playlists.');
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// Remove Tracks from Playlists
router.post('/remove', validator('addTracks'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    await SpotifyService.removeTracks(req.body);
    await TrackModel.removeTracks(req.body);
    res.send('Tracks removed from their coresponding playlists.');
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// Modify a single track's rating
router.patch('/rate/:id', validator('rateTrack'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const message = await TrackModel.rateTrack(req.params.id, req.body.rating);
  res.send(message);
});

module.exports = router;
