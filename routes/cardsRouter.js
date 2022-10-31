const cardsRouter = require('express').Router();
const { idCardValid, cardValid } = require('../middlewares/validation');
const {
  getCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cardController');

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardValid, postCard);
cardsRouter.delete('/:cardId', idCardValid, deleteCard);
cardsRouter.put('/:cardId/likes', idCardValid, putLike);
cardsRouter.delete('/:cardId/likes', idCardValid, deleteLike);

module.exports = cardsRouter;
