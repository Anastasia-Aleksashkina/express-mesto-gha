/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Card = require('../models/cardSchema');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.postCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка валидации. Переданы некорректные данные при создании карточки. ' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => res.status(404).send({ message: 'Карточка не найдена. ' }))
    .then((card) => {
      if (card.owner.cardId.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardDelete) => res.send(cardDelete));
      }
      return res.status(403).send({ message: 'Недостаточно прав для удаления карточки. ' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Не корректный _id карточки. ' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ' });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки. ' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка. ' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки. ' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка. ' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка. ' });
    });
};
