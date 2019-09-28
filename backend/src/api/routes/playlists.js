const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../../services/validator');
const SpotifyService = require('../../services/spotify');

// TODO: remove data from response
router.get('/', async (req, res, next) => {
  const response = await SpotifyService.refreshPlaylists();
  res.send(response);
});
// Create new Spotify playlist
router.post('/', validator('createPlaylist'), async (req, res, next) => {
  // validate request
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  // create playlist (also adds it locally)
  await SpotifyService.createPlaylist(req.body.name)
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  res.send('Successfully created new Playlist!');
});
// Remove Spotify playlist
router.delete('/:id', async (req, res, next) => {
  const message = await SpotifyService.deletePlaylist(req.params.id)
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  res.send(message);
});
// Modify Spotify playlist settings
router.patch('/:id', validator('modifyPlaylist'), async (req, res, next) => {
  // validate request
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const message = await PlaylistModel.modify(req.params.id, req.body)
  res.send(message);
});


// TESTING
const PlaylistModel = require('../../models/Playlist');
router.get('/test/:id', validator('modifyPlaylist'), async (req, res, next) => {
  // validate request
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const playlist = await PlaylistModel.modify(id, {})
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  res.send(playlist);
});

module.exports = router;