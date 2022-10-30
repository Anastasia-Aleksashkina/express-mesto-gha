const cardsRouter = require('express').Router();
const { idValid, cardValid } = require('../middlewares/validation');
const {
  getCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cardController');

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardValid, postCard);
cardsRouter.delete('/:cardId', idValid, deleteCard);
cardsRouter.put('/:cardId/likes', idValid, putLike);
cardsRouter.delete('/:cardId/likes', idValid, deleteLike);

module.exports = cardsRouter;
