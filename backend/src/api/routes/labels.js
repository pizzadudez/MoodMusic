const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../../services/validator');
const LabelModel = require('../../models/Label');
const LabelsService = require('../../services/labels');


// Get all labels separated by type
router.get('/labels', async (req, res, next) => {
  const list = await LabelsService.getAll()
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  res.send(list);
});
// Create new label
router.post('/labels', validator('createLabel'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const message = await LabelModel.create(req.body)
    .catch(err => {
      console.log(err); 
      res.send(err);
    });
  res.send(message);
});
// Add Labels to Tracks
router.post('/labels/add', validator('addLabels'), async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const message = await LabelModel.addLabels(req.body)
    .catch(err => {
      console.log(err);
      res.send(err)
    });
  res.send(message);
});
// Remove Labels from Tracks
router.post('/labels/remove', validator('addLabels'), async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  }
  const message = await LabelModel.removeLabels(req.body)
    .catch(err => {
      console.log(err);
      res.send(err)
    });
  res.send(message);
});
// Get a single label
router.get('/label/:id', async (req, res, next) => {
  const message = await LabelModel.get(req.params.id)
    .catch(err => {
      console.log(err);
      res.status(404).send(err);
    });
  res.send(message);
});
// Update label
router.patch('/label/:id', validator('updateLabel'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({errors: errors.array()});
    return;
  };
  const message = await LabelModel.update(req.params.id, req.body)
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  res.send(message);
});
// Delete label
router.delete('/label/:id', async (req, res, next) => {
  const message = await LabelModel.delete(req.params.id)
    .catch(err => {
      console.log(err);
      res.status(404).send(err);
    });
  res.send(message);
});

module.exports = router;