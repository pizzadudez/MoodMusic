const router = require('express').Router();
const controller = require('../controllers/playlists');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');

/* Playlist CRUD */
router.get('/playlists', controller.getAll);
router.post('/playlists', validate('newPlaylist'), controller.create);
router.patch(
  '/playlist/:id',
  validate('updatedPlaylist'),
  authorize('playlist'),
  controller.update
);
router.delete('/playlist/:id', authorize('playlist'), controller.delete);
router.get('/playlist/:id/restore', authorize('playlist'), controller.restore);

/* Playlist Operations */
router.get('/playlist/:id/sync', authorize('playlist'), controller.syncTracks);
router.get(
  '/playlist/:id/revert',
  authorize('playlist'),
  controller.revertTracks
);
// TODO: NYI
router.post(
  '/playlist/:id/reorder',
  authorize('playlist'),
  controller.reorderTracks
);

/* Playlist-Track associations */
router.post(
  '/playlists/add',
  validate('playlistTracks'),
  authorize('playlistTracks'),
  controller.addPlaylists
);
router.post(
  '/playlists/remove',
  validate('playlistTracks'),
  authorize('playlistTracks'),
  controller.removePlaylists
);

module.exports = router;
