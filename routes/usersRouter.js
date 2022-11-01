const usersRouter = require('express').Router();
const { userProfileValid, userAvatarValid, idUserValid } = require('../middlewares/validation');
const {
  getUsers,
  getUser,
  updateNameUser,
  updateAvatarUser,
} = require('../controllers/userController');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.get('/:userId', idUserValid, getUser);
usersRouter.patch('/me', userProfileValid, updateNameUser);
usersRouter.patch('/me/avatar', userAvatarValid, updateAvatarUser);

module.exports = usersRouter;
