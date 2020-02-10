const router = require('express').Router();
const controller = require('../controllers/tracks');
const validate = require('../middlewares/validate');

router.get('/tracks', controller.getAllTracks);
router.patch('/track/:id/remove', controller.removeTrack);
router.patch('/track/:id/rate', controller.rateTrack);
router.patch('/track/:id/like', controller.likeTrack);

router.get('/tracks/refresh', controller.refreshTracks);

module.exports = router;
