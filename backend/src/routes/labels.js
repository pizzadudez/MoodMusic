const router = require('express').Router();
const controller = require('../controllers/labels');
const validate = require('../middlewares/validate');

router.get('/labels', controller.getAllLabels);
router.post('/labels', validate('createLabel'), controller.createLabel);
router.patch('/label/:id', validate('updateLabel'), controller.updateLabel);
router.delete('/label/:id', controller.deleteLabel);

router.post('/labels/add', validate('addLabels'), controller.addLabels);
router.post('/labels/remove', validate('addLabels'), controller.removeLabels);

module.exports = router;
