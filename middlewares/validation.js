const { Joi, celebrate } = require('celebrate');
const { REGEXP_URL } = require('../utils/constants');

module.exports.loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.userValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().pattern(REGEXP_URL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.userProfileValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.userAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(REGEXP_URL),
  }),
});

module.exports.idValid = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.cardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(REGEXP_URL),
  }),
});
