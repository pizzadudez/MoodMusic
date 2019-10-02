const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../../services/validator');
const PlaylistModel = require('../../models/Playlist');
const SpotifyService = require('../../services/spotify');
const PlaylistService = require('../../services/playlists');

// TODO: remove data from response
router.get('/', async (req, res, next) => {
  const map = await PlaylistService.map();
  res.send(map);
});
// Create new Spotify playlist
router.post('/', validator('createPlaylist'), async (req, res, next) => {
  // validate request
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const message = await SpotifyService.createPlaylist(req.body.name);
  res.send(message);
});
// Remove Spotify playlist
router.delete('/:id', async (req, res, next) => {
  const message = await SpotifyService.deletePlaylist(req.params.id);
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

module.exports = router;