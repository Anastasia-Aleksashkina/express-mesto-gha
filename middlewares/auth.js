const jwt = require('jsonwebtoken');
const UnauthError = require('../utils/Errors/UnauthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  let payload;
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthError('Необходима авторизация'));
  }

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
