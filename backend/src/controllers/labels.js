const LabelModel = require('../models/Label');

exports.getAllLabels = async (req, res, next) => {
  try {
    const labels = await LabelModel.getAll();
    res.status(200).json(labels);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.addLabels = async (req, res, next) => {
  try {
    await LabelModel.addLabels(req.body);
    res.status(204).send('Associations added.');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.removeLabels = async (req, res, next) => {
  try {
    await LabelModel.removeLabels(req.body);
    res.status(204).send('Associations removed.');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};

exports.createLabel = async (req, res, next) => {
  try {
    const label = await LabelModel.createLabel(req.body);
    res.status(200).json(label);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
exports.updateLabel = async (req, res, next) => {
  try {
    const label = await LabelModel.updateLabel(req.params.id, req.body);
    res.status(200).json(label);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
//TODO
exports.deleteLabel = async (req, res, next) => {};
