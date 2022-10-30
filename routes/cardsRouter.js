const cardsRouter = require('express').Router();
const { idValid, cardValid } = require('../middlewares/validation');
const {
  getCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cardController');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', cardValid, postCard);
cardsRouter.delete('/cards/:cardId', idValid, deleteCard);
cardsRouter.put('/cards/:cardId/likes', idValid, putLike);
cardsRouter.delete('/cards/:cardId/likes', idValid, deleteLike);

module.exports = cardsRouter;
