const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const UnauthError = require('../utils/Errors/UnauthError');

module.exports = (req, res, next) => {
  let payload;
  const { authorization } = req.cookies;
  console.log(req.cookies);

  if (!authorization) {
    next(new UnauthError('Необходима авторизация'));
  }

  try {
    payload = jwt.verify(authorization, JWT_SECRET);
  } catch (err) {
    next(new UnauthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
