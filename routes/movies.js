const movieRouter = require('express').Router();
const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validators');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', createMovieValidator, createMovie);
movieRouter.delete('/:movieId', deleteMovieValidator, deleteMovie);

module.exports = movieRouter;
