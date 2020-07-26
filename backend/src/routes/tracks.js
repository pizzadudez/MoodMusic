const router = require('express').Router();
const controller = require('../controllers/tracks');
const validate = require('../middleware/validate');

router.get('/tracks', controller.getAll);
router.patch('/track/:id/like', validate('toggleLike'), controller.toggleLike);
// NOT YET IMPLEMENTED
router.patch('/track/:id/rate', controller.rate);
// NOT YET IMPLEMENTED
router.delete('/track/:id/delete', controller.delete);

router.get('/tracks/refresh', controller.refreshTracks);
router.get('/tracks/sync', controller.syncTracks);

module.exports = router;
