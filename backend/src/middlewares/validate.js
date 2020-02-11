const Joi = require('@hapi/joi');

const validate = field => {
  const schema = {
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
      type: Joi.string()
        .valid('genre', 'subgenre', 'mood')
        .required(),
      name: Joi.string()
        .min(2)
        .required(),
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
  };

  return (req, res, next) => {
    const { error } = schema[field].validate(req.body, { abortEarly: false });
    if (error) {
      console.log(error);
      const { details } = error;
      const message = details.map(e => e.message).join(',\n');
      console.log('Validation error: ', message);
      res.status(422).send(message);
    } else {
      next();
    }
  };
};

module.exports = validate;
