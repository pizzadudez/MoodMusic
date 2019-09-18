const express = require('express');
const router = express.Router();
const playlistsController = require('../controllers/playlists');

router.get('/', playlistsController.playlists);
router.get('/:playlist_id/tracks', playlistsController.tracks);

module.exports = router