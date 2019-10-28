const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../../services/validator');
const PlayerService = require('../../services/player');

router.post('/track', async (req, res, next) => {
  try {
    await PlayerService.playTrack(req.body.track_id);
    res.status(200).json({ message: 'Playing track!' })
  } catch (err) {
    res.send(err)
  }
});

module.exports = router;