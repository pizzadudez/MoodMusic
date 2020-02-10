const router = require('express').Router();
const controller = require('../controllers/labels');
const validate = require('../middlewares/validate');

router.get('/labels', controller.getAllLabels);
router.post('/labels', controller.createLabel);
router.patch('/label/:id', controller.updateLabel);
router.delete('/label/:id', controller.deleteLabel);

router.post('/labels/add', controller.addLabels);
router.post('/labels/remove', controller.removeLabels);

module.exports = router;
