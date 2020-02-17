const router = require('express').Router();
const TracksRouter = require('./tracks');
const PlaylistsRouter = require('./playlists');
const LabelsRouter = require('./labels');
const TestRouter = require('./test');

router.use('/', TracksRouter);
router.use('/', PlaylistsRouter);
router.use('/', LabelsRouter);
router.use('/test', TestRouter);

module.exports = router;
