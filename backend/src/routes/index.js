const router = require('express').Router();
const PlaylistsRouter = require('./playlists');
const TracksRouter = require('./tracks');
const LabelsRouter = require('./labels');
const PlayerRouter = require('./player');

router.use('/playlists', PlaylistsRouter);
router.use('/tracks', TracksRouter);
router.use('/', LabelsRouter);
router.use('/player', PlayerRouter);

module.exports = router;
