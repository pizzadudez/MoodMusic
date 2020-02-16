const router = require('express').Router();
const controller = require('../controllers/playlists');
const validate = require('../middlewares/validate');

router.get('/playlists', controller.getAll);
router.post(
  '/playlists/add',
  validate('addPlaylists'),
  controller.addPlaylists
);
router.post(
  '/playlists/remove',
  validate('addPlaylists'),
  controller.removePlaylists
);

router.post('/playlists', validate('createPlaylist'), controller.create);
router.patch('/playlist/:id', validate('updatePlaylist'), controller.update);
router.delete('/playlist/:id', controller.delete);
router.get('/playlist/:id/sync', controller.syncTracks);
router.get('/playlist/:id/revert', controller.revertChanges);
router.post('/playlist/:id/reorder', controller.reorderTracks);

module.exports = router;
