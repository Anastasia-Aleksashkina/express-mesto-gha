const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const UnauthError = require('../utils/Errors/UnauthError');

module.exports = (req, res, next) => {
  let payload;
  const { cookie } = req.headers;
  const token = cookie.replace('jwt=', '');

  if (!token) {
    next(new UnauthError('Необходима авторизация'));
  }

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
