const mongoose = require('mongoose');
const User = require('../models/userSchema');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => {
      res.status(500).send({ message: 'На сервере произошла ошибка.', err });
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка валидации. Переданы некорректные данные при создании пользователя. ', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ', err });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден. ' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Передан не корректный _id пользователя. ', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ', err });
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
        return res.status(400).send({ message: 'Ошибка валидации. Переданы некорректные данные при обновлении профиля. ', err });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Передан не корректный _id пользователя. ', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ', err });
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
        return res.status(400).send({ message: 'Передан не корректный _id пользователя. ', err });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка валидации. Переданы некорректные данные при обновлении аватара. ', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ', err });
    });
};
