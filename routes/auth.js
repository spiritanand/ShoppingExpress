const express = require('express');
const {
  getSignUp,
  getLogin,
  postSignUp,
  postLogin,
  postLogout,
} = require('../controllers/auth');

const router = express.Router();

router.get('/signup', getSignUp);
router.post('/signup', postSignUp);

router.get('/login', getLogin);
router.post('/login', postLogin);

router.post('/logout', postLogout);

module.exports = router;
