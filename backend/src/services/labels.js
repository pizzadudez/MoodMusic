const LabelModel = require('../models/Label');

exports.getAll = async () => {
  const labels = await LabelModel.getAll();
  return labels.reduce((obj, label) => {
    obj[label.type] = obj[label.type] || [];
    obj[label.type].push(label);
    return obj
  }, {});
};