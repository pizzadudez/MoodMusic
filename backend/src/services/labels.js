const LabelModel = require('../models/Label');

exports.createLabel = async label => {
  return await LabelModel.create(label);
};

exports.deleteLabel = async id => {
  return await LabelModel.delete(id);
};