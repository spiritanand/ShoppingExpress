const bcrypt = require('bcrypt');
const User = require('../models/user');
const { ERROR_MESSAGES } = require('../constants/constants');
const { handleCustomDBError } = require('../utils/handleErrors');

exports.getSignUp = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign Up',
  });
};

exports.postSignUp = async (req, res) => {
  const { username, email, password, type } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    type,
  });

  await user.save();

  req.session.user = user;
  await req.session.save();

  res.redirect('/');
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');
    const email = await User.findOne({ email: username });

    if (!user && !email) {
      throw new Error(ERROR_MESSAGES.INVALID_USERNAME);
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_USERNAME_PASSWORD);
    }

    // Store the user ID in the session
    req.session.user = user;

    return res.redirect('/');
  } catch (error) {
    return handleCustomDBError(error, res);
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return handleCustomDBError(err, res);
    }

    return res.redirect('/');
  });
};
