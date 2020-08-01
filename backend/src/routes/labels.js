const router = require('express').Router();
const controller = require('../controllers/labels');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');

/* Label CRUD */
router.get('/labels', controller.getAll);
router.post('/labels', validate('newLabel'), controller.create);
router.patch(
  '/label/:id',
  validate('updatedLabel'),
  authorize('label'),
  controller.update
);
router.delete('/label/:id', authorize('label'), controller.delete);

/* Label-Track associations */
router.post(
  '/labels/add',
  validate('labelTracks'),
  authorize('labelTracks'),
  controller.addLabels
);
router.post(
  '/labels/remove',
  validate('labelTracks'),
  authorize('labelTracks'),
  controller.removeLabels
);

module.exports = router;
