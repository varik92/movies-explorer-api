const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const updateCurrentUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required().min(1),
    year: Joi.number().integer().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка на постер к фильму');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка на трейлер фильма');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка на миниатюрное изображение постера к фильму');
    }),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  signInValidator,
  signUpValidator,
  updateCurrentUser,
  createMovieValidator,
  deleteMovieValidator,
};
