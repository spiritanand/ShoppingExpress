const express = require('express');
const {
  getSignUp,
  getLogin,
  postSignUp,
  postLogin,
  postLogout,
  getResetPassword,
  postResetPassword,
} = require('../controllers/auth');
const { isLoggedIn } = require('../middlewares/isAuth');

const router = express.Router();

router.get('/signup', getSignUp);
router.post('/signup', postSignUp);

router.get('/login', getLogin);
router.post('/login', postLogin);

router.post('/logout', isLoggedIn, postLogout);

router.get('/reset-password', isLoggedIn, getResetPassword);
router.post('/reset-password', isLoggedIn, postResetPassword);

module.exports = router;
