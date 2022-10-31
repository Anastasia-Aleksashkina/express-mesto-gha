const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, postUser } = require('./controllers/userController');
const { loginValid, userValid } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const { NotFoundError } = require('./utils/Errors/NotFoundError');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.post('/signin', loginValid, login);
app.post('/signup', userValid, postUser);
app.use(auth);
app.use('/users', require('./routes/usersRouter'));
app.use('/cards', require('./routes/cardsRouter'));

app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден. '));
});
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
