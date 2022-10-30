const usersRouter = require('express').Router();
const { userProfileValid, userAvatarValid, idValid } = require('../middlewares/validation');
const {
  getUsers,
  postUser,
  getUser,
  updateNameUser,
  updateAvatarUser,
} = require('../controllers/userController');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUser);
usersRouter.post('/users', postUser);
usersRouter.get('/users/:userId', idValid, getUser);
usersRouter.patch('/users/me', userProfileValid, updateNameUser);
usersRouter.patch('/users/me/avatar', userAvatarValid, updateAvatarUser);

module.exports = usersRouter;
