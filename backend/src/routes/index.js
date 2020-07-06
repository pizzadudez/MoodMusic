const router = require('express').Router();
const { authenticateJwt, refreshJwt } = require('../middleware/auth');
const TracksRouter = require('./tracks');
const PlaylistsRouter = require('./playlists');
const LabelsRouter = require('./labels');

router.use(
  '/',
  // Auth middleware
  authenticateJwt,
  refreshJwt,
  // Resource specific routers
  TracksRouter,
  PlaylistsRouter,
  LabelsRouter
);

module.exports = router;
