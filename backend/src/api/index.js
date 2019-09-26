const router = require('express').Router();
const PlaylistsRouter = require('./routes/playlists');
const TracksRouter = require('./routes/tracks');

router.use('/playlists', PlaylistsRouter);
router.use('/tracks', TracksRouter);

module.exports = router;