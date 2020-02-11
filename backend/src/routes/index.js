const router = require('express').Router();
const TracksRouter = require('./tracks');
const PlaylistsRouter = require('./playlists');
const LabelsRouter = require('./labels');

router.use('/', TracksRouter);
router.use('/', PlaylistsRouter);
router.use('/', LabelsRouter);

const _PlaylistsRouter = require('./_playlists');
const _TracksRouter = require('./_tracks');
const _LabelsRouter = require('./_labels');
const _PlayerRouter = require('./_player');

router.use('/v1/playlists', _PlaylistsRouter);
router.use('/v1/tracks', _TracksRouter);
router.use('/v1/', _LabelsRouter);
router.use('/v1/player', _PlayerRouter);

module.exports = router;
