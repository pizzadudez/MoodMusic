const router = require('express').Router();
const controller = require('../controllers/playlists');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');

/* Playlist CRUD */
router
  .route('/playlists')
  .get(controller.getAll)
  .post(validate('newPlaylist'), controller.create);
router
  .route('/playlist/:id')
  .patch(validate('updatedPlaylist'), authorize('playlist'), controller.update)
  .delete(authorize('playlist'), controller.delete);
router
  .route('/playlist/:id/restore')
  .get(authorize('playlist'), controller.restore);

/* Playlist Operations */
router
  .route('/playlist/:id/sync')
  .get(authorize('playlist'), controller.syncTracks);
router
  .route('/playlist/:id/revert')
  .get(authorize('playlist'), controller.revertTracks);
router
  .route('/playlist/:id/reorder') // TODO: NYI
  .post(authorize('playlist'), controller.reorderTracks);

/* Playlist-Track associations */
router
  .route('/playlists/add')
  .post(
    validate('playlistTracks'),
    authorize('playlistTracks'),
    controller.addPlaylists
  );
router
  .route('/playlists/remove')
  .post(
    validate('playlistTracks'),
    authorize('playlistTracks'),
    controller.removePlaylists
  );

module.exports = router;
