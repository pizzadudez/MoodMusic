const LabelModel = require('../models/Label');

// Label map 
exports.map = async () => {
  try {
    const labels = await LabelModel.getAll();
    const map = labels.reduce((map, label) => {
      map[label.id] = label;
      return map;
    }, {});
    return map;
  } catch (err) {
    console.log(err);
    return err;
  }
};