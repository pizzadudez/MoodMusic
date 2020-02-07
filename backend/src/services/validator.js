const { body } = require('express-validator');

const validate = method => {
  switch (method) {
    case 'createLabel': {
      return [
        body('type', 'Types: genre|subgenre|mood.').isIn([
          'genre',
          'subgenre',
          'mood',
        ]),
        body('name', '"name" is mandatory.').exists(),
        body(
          'verbose',
          '"verbose" must only contain letters or numbers'
        ).optional(),
        body(
          'suffix',
          '"suffix" must only contain letters or numbers'
        ).optional(),
        body('parent_id', 'Value must be a genre id.')
          .if(body('type').equals('subgenre'))
          .exists()
          .isInt(),
        body('color', 'Must be hex color code')
          .exists()
          .isHexColor(),
      ];
    }
    case 'updateLabel': {
      return [
        body('name', '"name" must only contain letters or numbers').optional(),
        body(
          'verbose',
          '"verbose" must only contain letters or numbers'
        ).optional(),
        body(
          'suffix',
          '"suffix" must only contain letters or numbers'
        ).optional(),
        body('parent_id', '"parent_id" must be a valid label_id (integer)')
          .optional()
          .isInt(),
        body('color', '"color" must be hex color code')
          .optional()
          .isHexColor(),
      ];
    }
    case 'addLabels': {
      return [
        body('*.track_id').exists(),
        body('*.label_ids').custom(list => isArray(list)),
        body('*.label_ids.*').isNumeric(),
      ];
    }
    case 'addTracks': {
      return [
        body('*.playlist_id').exists(),
        body('*.tracks').custom(list => isArray(list)),
        body('*.tracks.*').isAlphanumeric(),
      ];
    }
    case 'createPlaylist': {
      return [body('name').exists()];
    }
    case 'modifyPlaylist': {
      return [
        body('tracking')
          .optional()
          .isBoolean(),
        body('genre_id')
          .optional()
          .isNumeric(),
        body('mood_playlist')
          .optional()
          .isBoolean(),
      ];
    }
    case 'modifyPlaylists': {
      return [
        body('')
          .isArray()
          .exists(),
        body('*.playlist_id').exists(),
        body('*.tracking')
          .optional()
          .isBoolean(),
        body('*.genre_id')
          .optional()
          .isNumeric(),
        body('*.mood_playlist')
          .optional()
          .isBoolean(),
      ];
    }
    case 'rateTrack': {
      return [body('rating', 'Rating must be 0|1|2|3').isIn([0, 1, 2, 3])];
    }
    case 'reorderTracks': {
      return [
        body('tracks', '<tracks> must be an array of track ids').isArray(),
      ];
    }
  }
};

// Check for arrays
const isArray = array => {
  if (!Array.isArray(array)) {
    throw new Error('label_ids must be of type Array');
  } else {
    return true;
  }
};

module.exports = validate;
