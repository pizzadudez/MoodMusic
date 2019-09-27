const router = require('express').Router();
const PlaylistsRouter = require('./routes/playlists');
const TracksRouter = require('./routes/tracks');
const LabelsRouter = require('./routes/labels');

router.use('/playlists', PlaylistsRouter);
router.use('/tracks', TracksRouter);
router.use('/', LabelsRouter);

module.exports = router;