const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const UnauthError = require('../utils/Errors/UnauthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
