const router = require('express').Router();
const controller = require('../controllers/playlists');
const validate = require('../middleware/validate');

router.get('/playlists', controller.getAll);
// User resources validation
router.post(
  '/playlists/add',
  validate('addPlaylists'),
  controller.addPlaylists
);
// User resources validation
router.post(
  '/playlists/remove',
  validate('addPlaylists'),
  controller.removePlaylists
);

router.post('/playlists', validate('createPlaylist'), controller.create);
// Not yet updated, check again
router.patch('/playlist/:id', validate('updatePlaylist'), controller.update);
// Not yet updated, check again
router.delete('/playlist/:id', controller.delete);
// Not yet updated, check again
router.get('/playlist/:id/restore', controller.restore);

// Not yet updated, check again
router.get('/playlist/:id/sync', controller.syncTracks);
// Not yet updated, check again
router.get('/playlist/:id/revert', controller.revertTracks);

// NOT YET IMPLEMENTED
router.post('/playlist/:id/reorder', controller.reorderTracks);

module.exports = router;
