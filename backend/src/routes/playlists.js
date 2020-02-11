const router = require('express').Router();
const controller = require('../controllers/playlists');
const validate = require('../middlewares/validate');

router.get('/playlists', controller.getAll);
router.post('/playlists', controller.create);
router.patch('/playlist/:id', controller.update);
router.delete('/playlist/:id', controller.delete);

router.post('/playlists/refresh', controller.refreshPlaylists);
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
router.post('/playlist/:id/reorder', controller.reorderTracks);

module.exports = router;
