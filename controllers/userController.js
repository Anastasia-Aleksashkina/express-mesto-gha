const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const { MONGO_DB_CODE } = require('../utils/constants');
const BadRequestError = require('../utils/Errors/BadRequestError'); // 400
const NotFoundError = require('../utils/Errors/NotFoundError'); // 404
const ConflictError = require('../utils/Errors/ConflictError'); // 409
const UnauthError = require('../utils/Errors/UnauthError'); // 401

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.postUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      if (err.code === MONGO_DB_CODE) {
        return next(new ConflictError('Пользователь с таким email уже существует. '));
      }
      if (err.message === 'Validation failed') {
        return next(new BadRequestError('Ошибка валидации. Переданы некорректные данные при создании профиля. '));
      }
      return next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId || req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError('Пользователь по указанному _id не найден. '));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан не корректный _id пользователя. '));
      }
      return next(err);
    });
};

module.exports.updateNameUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((updateProfile) => res.send(updateProfile))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError('Пользователь по указанному _id не найден. '));
      }
      if (err.message === 'Validation failed') {
        return next(new BadRequestError('Ошибка валидации. Переданы некорректные данные при обновлении профиля. '));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан не корректный _id пользователя. '));
      }
      return next(err);
    });
};

module.exports.updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((updateAvatar) => res.send(updateAvatar))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError('Пользователь по указанному _id не найден. '));
      }
      if (err.message === 'Validation failed') {
        return next(new BadRequestError('Ошибка валидации. Переданы некорректные данные при обновлении аватара. '));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан не корректный _id пользователя. '));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: 'Авторизация прошла успешно. ', token });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        return next(new UnauthError(err.message));
      }
      return next(err);
    });
};
