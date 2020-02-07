const router = require('express').Router();
const { validationResult } = require('express-validator');
const validator = require('../../services/validator');
const LabelModel = require('../../models/Label');
const LabelsService = require('../../services/labels');

// Get all labels (array of objects)
router.get('/labels', async (req, res, next) => {
  try {
    const labelsById = await LabelModel.getAll();
    res.status(200).json(labelsById);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error.');
  }
});
// Create new label
router.post('/labels', validator('createLabel'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    const response = await LabelModel.create(req.body);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error.');
  }
});
// // Update existing label
// router.patch(
//   '/labels/:id',
//   validator('updateLabel'),
//   async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(422).json({ errors: errors.array() });
//       return;
//     }
//     try {
//       const response = await LabelModel.update(req.params.id, req.body);
//       res.status(200).json(response);
//     } catch (err) {
//       console.log(err);
//       res.status(400).json({ error: err });
//     }
//   }
// );

// Add Labels to Tracks
router.post('/labels/add', validator('addLabels'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  if (req.body.length < 1) {
    res.status(400).json({ errors: 'Empty request' });
    return;
  }
  const message = await LabelModel.addLabels(req.body).catch(err => {
    console.log(err);
    res.send(err);
  });
  res.send(message);
});
// Remove Labels from Tracks
router.post(
  '/labels/remove',
  validator('addLabels'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    if (req.body.length < 1) {
      res.status(400).json({ errors: 'Empty request' });
      return;
    }
    const message = await LabelModel.removeLabels(req.body).catch(err => {
      console.log(err);
      res.send(err);
    });
    res.send(message);
  }
);

// Get a single label
router.get('/label/:id', async (req, res, next) => {
  try {
    const response = await LabelModel.getOne(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
});
// Update label
router.patch('/label/:id', validator('updateLabel'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    const response = await LabelModel.update(req.params.id, req.body);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
});
// Delete label
router.delete('/label/:id', async (req, res, next) => {
  const message = await LabelModel.delete(req.params.id).catch(err => {
    console.log(err);
    res.status(404).send(err);
  });
  res.send(message);
});

module.exports = router;
