const router = require('express').Router();
const controller = require('../controllers/playlists');
const validate = require('../middlewares/validate');

router.get('/playlists', controller.getAllPlaylists);
router.post('/playlists', controller.createPlaylist);
router.patch('/playlist/:id', controller.updatePlaylist);
router.delete('/playlist/:id', controller.deletePlaylist);

router.post('/playlists/refresh', controller.refreshPlaylists);
router.post('/playlists/add', controller.addPlaylists);
router.post('/playlists/remove', controller.removePlaylists);
router.post('/playlist/:id/reorder', controller.reorderPlaylistTracks);

module.exports = router;
