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
exports.createLabel = async (req, res, next) => {};
exports.updateLabel = async (req, res, next) => {};
exports.deleteLabel = async (req, res, next) => {};
exports.addLabels = async (req, res, next) => {};
exports.removeLabels = async (req, res, next) => {};
