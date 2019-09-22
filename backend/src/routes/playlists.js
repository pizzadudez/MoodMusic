const express = require('express');
const router = express.Router();
const playlistsController = require('../controllers/playlists');

router.get('/', playlistsController.refreshPlaylists);
router.get('/tracks', playlistsController.refreshTracks);

module.exports = router