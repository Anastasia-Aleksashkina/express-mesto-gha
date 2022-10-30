const express = require('express');
const mongoose = require('mongoose');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');
const { login, postUser } = require('./controllers/userController');
const { loginValid, userValid } = require('./middlewares/validation');
const auth = require('./middlewares/auth');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
mongoose.connect(MONGO_URL);

// app.use((req, res, next) => {
//   req.user = {
//     _id: '634d4aaa8206df95c28493f2',
//   };

//   next();
// });

app.post('/signin', loginValid, login);
app.post('/signup', userValid, postUser);
app.use(auth);
app.use('/users', require('./routes/usersRouter'));
app.use('/cards', require('./routes/cardsRouter'));

app.use(cardsRouter);
app.use(usersRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден.' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
