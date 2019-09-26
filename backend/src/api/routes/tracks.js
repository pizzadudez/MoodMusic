const router = require('express').Router();
const SpotifyService = require('../../services/spotify');

router.get('/', async (req, res, next) => {
  try {
    await SpotifyService.refreshPlaylists();
    const message = await SpotifyService.refreshTracks();
    res.send(message);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;