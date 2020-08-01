const router = require('express').Router();
const controller = require('../controllers/tracks');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');

/* Track CRUD */
router.get('/tracks', controller.getAll);
// TODO? merge like with rate and create route to modify multiple tracks (maybe)
router.patch('/track/:id/like', validate('toggleBool'), controller.toggleLike);
// NYI
router.patch('/track/:id/rate', controller.rate);
// NYI
router.delete('/track/:id/delete', controller.delete);

/* Track Operations */
router.get('/tracks/refresh', controller.refreshTracks);
router.get('/tracks/sync', controller.syncTracks);

module.exports = router;
