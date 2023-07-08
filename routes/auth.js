const express = require('express');
const { getSignUp, getLogin } = require('../controllers/auth');

const router = express.Router();

router.get('/signup', getSignUp);
router.get('/login', getLogin);

module.exports = router;
