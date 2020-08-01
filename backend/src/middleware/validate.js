const Joi = require('@hapi/joi');

const schema = {
  labelTracks: Joi.array().items(
    Joi.object()
      .keys({
        label_id: Joi.number().required(),
        track_ids: Joi.array().items(Joi.string().required()),
      })
      .required()
  ),
  playlistTracks: Joi.array().items(
    Joi.object()
      .keys({
        playlist_id: Joi.string().required(),
        track_ids: Joi.array().items(Joi.string().required()),
      })
      .required()
  ),
  newLabel: Joi.object().keys({
    type: Joi.string().valid('genre', 'subgenre', 'mood').required(),
    name: Joi.string().min(2).required(),
    color: Joi.string()
      .regex(/^#[A-Fa-f0-9]{6}/)
      .required(),
    parent_id: Joi.when('type', {
      is: 'subgenre',
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
    verbose: Joi.string(),
    suffix: Joi.string().when('type', {
      is: 'subgenre',
      then: Joi.string(),
      otherwise: Joi.forbidden(),
    }),
  }),
  updatedLabel: Joi.object().keys({
    type: Joi.string().valid('genre', 'subgenre', 'mood'),
    name: Joi.string().min(2),
    color: Joi.string().regex(/^#[A-Fa-f0-9]{6}/),
    parent_id: Joi.when('type', {
      is: 'subgenre',
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
    verbose: Joi.string(),
    suffix: Joi.string().when('type', {
      is: 'subgenre',
      then: Joi.string(),
      otherwise: Joi.forbidden(),
    }),
  }),
  newPlaylist: Joi.object().keys({
    name: Joi.when('type', {
      is: 'label',
      then: Joi.string().min(2),
      otherwise: Joi.string().min(2).required(),
    }),
    description: Joi.string(),
    type: Joi.string().valid('label', 'mix').required(),
    label_id: Joi.when('type', {
      is: 'label',
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
  }),
  updatedPlaylist: Joi.object().keys({
    name: Joi.string().min(2),
    description: Joi.string(),
    type: Joi.string().valid('label', 'mix', 'untracked'),
    label_id: Joi.when('type', {
      is: 'label',
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
  }),
  // TODO: remove this eventually after changing track route for like/rate
  toggleBool: Joi.object().keys({
    toggle: Joi.boolean().required(),
  }),
};

/**
 * Validate request body using Joi.
 * @param {string} name - Joi validation object identifier
 */
const validate = name => (req, res, next) => {
  const { error } = schema[name].validate(req.body, { abortEarly: false });

  if (error) {
    const details = error.details.map(d => d.message);
    console.log('Validation error: ', details.join('\n'));
    res.status(422).json({ message: 'Validation Failed', errors: details });
  } else {
    next();
  }
};

module.exports = validate;
