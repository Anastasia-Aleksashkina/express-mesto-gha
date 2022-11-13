require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, postUser, logout } = require('./controllers/userController');
const { loginValid, userValid } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const NotFoundError = require('./utils/Errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const allowedCors = require('./middlewares/allowedCors');

const { PORT = 3001, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(allowedCors);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', loginValid, login);
app.post('/signup', userValid, postUser);
app.post('/logout', logout);
app.use(auth);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});
app.use('/users', require('./routes/usersRouter'));
app.use('/cards', require('./routes/cardsRouter'));

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден. '));
});
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
