const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const { MONGO_DB_CODE } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.postUser = (req, res) => {
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
        return res.status(409).send({ message: 'Пользователь с таким email уже существует. ' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId || req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден. ' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Передан не корректный _id пользователя. ' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ' });
    });
};

module.exports.updateNameUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((updateProfile) => res.send(updateProfile))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден. ' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка валидации. Переданы некорректные данные при обновлении профиля. ' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Передан не корректный _id пользователя. ' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ' });
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((updateAvatar) => res.send(updateAvatar))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден. ' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Передан не корректный _id пользователя. ' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка валидации. Переданы некорректные данные при обновлении аватара. ' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ' });
    });
};

module.exports.login = (req, res) => {
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
      console.log(err);
    });
};
