const router = require('express').Router();
const SpotifyService = require('../../services/spotify');

// TODO: remove data from response
router.get('/', async (req, res, next) => {
  const response = await SpotifyService.refreshPlaylists();
  res.send(response);
});

module.exports = router;