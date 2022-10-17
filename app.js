const express = require('express');
const mongoose = require('mongoose');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
mongoose.connect(MONGO_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '634d4aaa8206df95c28493f2',
  };

  next();
});

app.use(cardsRouter);
app.use(usersRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден.' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
