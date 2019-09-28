const { body } = require('express-validator');

const validate = method => {
  switch (method) {
    case 'createLabel': {
      return [
        body('type', 'Types: genre|subgenre|mood.')
          .isIn(['genre', 'subgenre', 'mood']),
        body('name', '"name" is mandatory.')
          .exists(),
        body('parent_id', 'Value must be a genre id.')
          .if(body('type').equals('subgenre')).exists().isInt(),
        body('color', 'Must be hex color code')
          .optional().isHexColor()
      ];
    }
    case 'updateLabel': {
      return [
        body('name', '<name> must only contain letters').optional(),
        body('parent_id', 'Value must be a label id.').optional().isInt(),
        body('color', 'Must be hex color code').optional().isHexColor()
      ];
    }
    case 'addLabels': {
      return [
        body('*.track_id').exists(),
        body('*.label_ids').custom(list => isArray(list)),
        body('*.label_ids.*').isNumeric()
      ];
    }
    case 'addTracks': {
      return [
        body('*.playlist_id').exists(),
        body('*.track_ids').custom(list => isArray(list)),
        body('*.track_ids.*').isAlphanumeric(),
      ];
    }
    case 'createPlaylist': {
      return [
        body('name').exists()
      ];
    }
    case 'modifyPlaylist': {
      return [
        body('tracking').optional().isBoolean(),
        body('genre_id').optional().isNumeric(),
        body('mood_playlist').optional().isBoolean()
      ]
    }
  } 
};

// Check for arrays
const isArray = array => {
  if(!Array.isArray(array)) {
    throw new Error('label_ids must be of type Array');
  } else {
    return true;
  }
};

module.exports = validate;