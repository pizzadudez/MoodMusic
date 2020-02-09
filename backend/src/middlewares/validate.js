const Joi = require('@hapi/joi');

const validate = field => {
  const schema = {
    test: Joi.object().keys({
      test: Joi.string().required(),
      array: Joi.array()
        .items(Joi.string())
        .required(),
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
