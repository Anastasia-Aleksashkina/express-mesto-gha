const usersRouter = require('express').Router();
const { userProfileValid, userAvatarValid, idValid } = require('../middlewares/validation');
const {
  getUsers,
  postUser,
  getUser,
  updateNameUser,
  updateAvatarUser,
} = require('../controllers/userController');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.post('/', postUser);
usersRouter.get('/:userId', idValid, getUser);
usersRouter.patch('/me', userProfileValid, updateNameUser);
usersRouter.patch('/me/avatar', userAvatarValid, updateAvatarUser);

module.exports = usersRouter;
