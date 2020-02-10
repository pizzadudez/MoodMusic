const router = require('express').Router();
const TracksRouter = require('./tracks');
const PlaylistsRouter = require('./playlists');
const LabelsRouter = require('./labels');

router.use('/v2', TracksRouter);
router.use('/v2', PlaylistsRouter);
router.use('/v2', LabelsRouter);

const _PlaylistsRouter = require('./_playlists');
const _TracksRouter = require('./_tracks');
const _LabelsRouter = require('./_labels');
const _PlayerRouter = require('./_player');

router.use('/playlists', _PlaylistsRouter);
router.use('/tracks', _TracksRouter);
router.use('/', _LabelsRouter);
router.use('/player', _PlayerRouter);

module.exports = router;
