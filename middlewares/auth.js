const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const UnauthError = require('../utils/Errors/UnauthError');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return next(new UnauthError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    return next(new UnauthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
