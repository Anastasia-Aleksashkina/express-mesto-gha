const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');
const { login, postUser } = require('./controllers/userController');
const { loginValid, userValid } = require('./middlewares/validation');
const auth = require('./middlewares/auth');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
mongoose.connect(MONGO_URL);

app.post('/signin', loginValid, login);
app.post('/signup', userValid, postUser);
app.use(auth);
app.use('/users', require('./routes/usersRouter'));
app.use('/cards', require('./routes/cardsRouter'));

app.use(cardsRouter);
app.use(usersRouter);

app.use(errors());
app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
