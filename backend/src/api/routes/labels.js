const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../../services/validator');
const LabelsService = require('../../services/labels');


// Get all labels separated by type
router.get('/', (req, res, next) => {
  res.send('GET labels');
});
// Create new label
router.post('/', validator('createLabel'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const message = await LabelsService.createLabel(req.body)
    .catch(err => {
      console.log(err); 
      res.send(err);
    });
  res.send(message);
});
// Get a single label
router.get('/:id', (req, res, next) => {
  res.send(`GET label ${req.params.id}`);
});
// Update label
router.patch('/:id', (req, res, next) => {
  res.send(`PATCH label ${req.params.id}`);
});
// Delete label
router.delete('/:id', async (req, res, next) => {
  const message = await LabelsService.deleteLabel(req.params.id)
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
  res.send(message);
});

module.exports = router;