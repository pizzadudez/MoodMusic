const LabelModel = require('../models/knex/Label');
const LabelsService = require('../services/labels');

exports.getAll = async (req, res, next) => {
  try {
    const labelsById = await LabelModel.getAllById(req.user.userId);
    res.status(200).json(labelsById);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};
exports.addLabels = async (req, res, next) => {
  try {
    await LabelModel.addLabels(req.body);
    res.status(200).send('Labels added to Tracks.');
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};
exports.removeLabels = async (req, res, next) => {
  try {
    await LabelModel.removeLabels(req.body);
    res.status(200).send('Labels removed from Tracks.');
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};

exports.create = async (req, res, next) => {
  try {
    const label = await LabelModel.create(req.user.userId, req.body);
    res.status(200).json(label);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};
exports.update = async (req, res, next) => {
  try {
    const label = await LabelModel.update(
      req.user.userId,
      req.params.id,
      req.body
    );
    res.status(200).json(label);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};
// TODO
exports.delete = async (req, res, next) => {
  try {
    await LabelsService.delete(req.params.id);
    res.status(200).send('Successfully deleted.');
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};
