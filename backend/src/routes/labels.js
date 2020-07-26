const router = require('express').Router();
const controller = require('../controllers/labels');
const validate = require('../middleware/validate');

router.get('/labels', controller.getAll);
router.post('/labels', validate('createLabel'), controller.create);
router.patch('/label/:id', validate('updateLabel'), controller.update);
// Not working currently, Label service for deletion deprecated
router.delete('/label/:id', controller.delete);

// User resources validation
router.post('/labels/add', validate('addLabels'), controller.addLabels);
// User resources validation
router.post('/labels/remove', validate('addLabels'), controller.removeLabels);

module.exports = router;
