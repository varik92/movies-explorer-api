const router = require('express').Router();

const { createUser, login, logout } = require('../controllers/users');
const { signInValidator, signUpValidator } = require('../middlewares/validators');
const { auth } = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');

const movieRouter = require('./movies');
const userRouter = require('./users');

router.post('/signup', signUpValidator, createUser);
router.post('/signin', signInValidator, login);
router.post('/signout', logout);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => next(new NotFound('Неправильный путь')));

module.exports = router;
