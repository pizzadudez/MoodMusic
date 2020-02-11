const router = require('express').Router();
const controller = require('../controllers/tracks');
const validate = require('../middlewares/validate');

router.get('/tracks', controller.getAll);
router.patch('/track/:id/delete', controller.delete);
router.patch('/track/:id/rate', controller.rate);
router.patch('/track/:id/like', controller.like);

router.get('/tracks/refresh', controller.refreshTracks);

module.exports = router;
