const Card = require('../models/cardSchema');
const BadRequestError = require('../utils/Errors/BadRequestError'); // 400
const NotFoundError = require('../utils/Errors/NotFoundError'); // 404
const ForbiddenError = require('../utils/Errors/ForbiddenError'); // 403

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Validation failed') {
        return next(new BadRequestError('Ошибка валидации. Переданы некорректные данные при создании карточки. '));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(req.params.cardId)
          .then((cardDelete) => res.send(cardDelete));
      }
      return next(new ForbiddenError('Недостаточно прав для удаления карточки. '));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Не корректный _id карточки. '));
      }
      if (err.message === 'NotFound') {
        return next(new NotFoundError('Передан несуществующий _id карточки. '));
      }

      return next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError('Передан несуществующий _id карточки. '));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка. '));
      }
      return next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError('Передан несуществующий _id карточки. '));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка. '));
      }
      return next(err);
    });
};
