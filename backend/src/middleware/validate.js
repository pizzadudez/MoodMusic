const Joi = require('@hapi/joi');
const UserModel = require('../models/User');

const FORBIDDEN = `Forbidden: Request contains resource identifiers\
 that do not belong to the user.`;
const validationSchema = {
  addLabels: Joi.array().items(
    Joi.object()
      .keys({
        label_id: Joi.number().required(),
        track_ids: Joi.array().items(Joi.string().required()),
      })
      .required()
  ),
  addPlaylists: Joi.array().items(
    Joi.object()
      .keys({
        playlist_id: Joi.string().required(),
        track_ids: Joi.array().items(Joi.string().required()),
      })
      .required()
  ),
  createLabel: Joi.object().keys({
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
  updateLabel: Joi.object().keys({
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
  createPlaylist: Joi.object().keys({
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
  updatePlaylist: Joi.object().keys({
    name: Joi.string().min(2),
    description: Joi.string(),
    type: Joi.string().valid('label', 'mix', 'untracked'),
    label_id: Joi.when('type', {
      is: 'label',
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
  }),
  toggleLike: Joi.object().keys({
    toggle: Joi.boolean().required(),
  }),
};

const authorizeResource = type => async (req, res, next) => {
  const { userId } = req.user;
  let authorized = true;

  switch (type) {
    case 'addLabels': {
      const labelIds = req.body.map(({ label_id }) => label_id);
      authorized = await UserModel.checkLabels(userId, labelIds);
      break;
    }
    case 'addPlaylists': {
      const playlistIds = req.body.map(({ playlist_id }) => playlist_id);
      authorized = await UserModel.checkPlaylists(userId, playlistIds);
      break;
    }
  }

  if (authorized) next();
  else res.status(403).json({ message: FORBIDDEN });
};

const validate = type => async (req, res, next) => {
  // TODO: sometimes we'll validate req.params, we wont need Joi validation
  const { error } = validationSchema[type].validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    console.log(error);
    const { details } = error;
    const message = details.map(e => e.message).join(',\n');
    console.log('Validation error: ', message);
    res.status(422).send(message);
  } else {
    return authorizeResource(type)(req, res, next);
  }
};

module.exports = validate;
