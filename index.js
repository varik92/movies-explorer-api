require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimiter = require('./middlewares/rateLimiter');
const router = require('./routes/index');
const NotFound = require('./errors/NotFound');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsHandler = require('./middlewares/corsHandler');

const { PORT = 3000, MONGODB_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);
/* app.use(rateLimiter); */
app.use(helmet());

app.use(corsHandler);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(router);

app.use('*', (req, res, next) => next(new NotFound('Неправильный путь')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
