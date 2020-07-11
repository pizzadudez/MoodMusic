const router = require('express').Router();
const { authenticateJwt, refreshJwt } = require('../middleware/auth');
const TracksRouter = require('./tracks');
const PlaylistsRouter = require('./playlists');
const LabelsRouter = require('./labels');
const TestRouter = require('./test');

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

// For Testing
router.use('/test', TestRouter);
router.use(
  '/test/auth',
  // Auth middleware
  authenticateJwt,
  refreshJwt,
  // Route
  TestRouter
);

module.exports = router;
