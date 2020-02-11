const router = require('express').Router();
const controller = require('../controllers/labels');
const validate = require('../middlewares/validate');

router.get('/labels', controller.getAll);
router.post('/labels', validate('createLabel'), controller.create);
router.patch('/label/:id', validate('updateLabel'), controller.update);
router.delete('/label/:id', controller.delete);

router.post('/labels/add', validate('addLabels'), controller.addLabels);
router.post('/labels/remove', validate('addLabels'), controller.removeLabels);

module.exports = router;
