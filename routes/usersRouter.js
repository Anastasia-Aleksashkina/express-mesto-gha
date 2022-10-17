const usersRouter = require('express').Router();
const {
  getUsers,
  postUser,
  getUser,
  updateNameUser,
  updateAvatarUser,
} = require('../controllers/userController');

usersRouter.get('/users', getUsers);
usersRouter.post('/users', postUser);
usersRouter.get('/users/:userId', getUser);
usersRouter.patch('/users/me', updateNameUser);
usersRouter.patch('/users/me/avatar', updateAvatarUser);

module.exports = usersRouter;
