const router = require('express').Router();
const PlaylistsRouter = require('./routes/playlists');
const TracksRouter = require('./routes/tracks');
const LabelsRouter = require('./routes/labels');
const PlayerRouter = require('./routes/player');

router.use('/playlists', PlaylistsRouter);
router.use('/tracks', TracksRouter);
router.use('/', LabelsRouter);
router.use('/player', PlayerRouter);

module.exports = router;