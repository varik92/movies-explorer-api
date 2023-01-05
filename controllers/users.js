const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const InternalServerError = require('../errors/InternalServerError');
const EmailExist = require('../errors/EmailExist');
const Unauthorized = require('../errors/Unauthorized');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  const createUser = (hash) => User.create({
    name,
    email,
    password: hash,
  });

  bcrypt
    .hash(password, 10)
    .then((hash) => createUser(hash))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new EmailExist('Пользователь с таким Email уже существует'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      return next(new NotFound('Пользователь по указанному id не найден'));
    }
    return res.send({ data: user });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
    } else if (err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(new InternalServerError('Произошла ошибка'));
    }
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      return res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Неверные учетные данные'));
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы успешно вышли из аккаунта' });
};

module.exports.getMe = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return next(new NotFound('Пользователь не существует, либо был удален'));
    })
    .catch(() => next(new InternalServerError('Произошла ошибка')));
};
