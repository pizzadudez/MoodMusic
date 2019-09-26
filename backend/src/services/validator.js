const { body } = require('express-validator');

const validate = method => {
  switch (method) {
    case 'createLabel': {
      return [
        body('type', 'Types: genre/subgenre/mood.').isIn(['genre', 'subgenre', 'mood']),
        body('name', 'No name provided.').exists(),
        body('parent_id', 'Value must be a label id.')
          .if(body('type').equals('subgenre')).exists().isInt(),
        body('color', 'Must be hex color code').optional().isHexColor()
      ];
    }
  } 
};

module.exports = validate;