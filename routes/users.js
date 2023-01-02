const userRouter = require('express').Router();

const {
  updateCurrentUser,
} = require('../middlewares/validators');

const {
  getMe,
  updateUser,
} = require('../controllers/users');

userRouter.get('/me', getMe);
userRouter.patch('/me', updateCurrentUser, updateUser);

module.exports = userRouter;