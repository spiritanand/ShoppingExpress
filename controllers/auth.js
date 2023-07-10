const bcrypt = require('bcrypt');
const User = require('../models/user');
const { ERROR_MESSAGES } = require('../constants/constants');
const { handleCustomDBError } = require('../utils/handleErrors');

exports.getSignUp = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign Up',
  });
};

exports.postSignUp = (req, res) => {
  const { name, email, password } = req.body;
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
  });
};

exports.postLogin = async (req, res) => {
  // try {
  //   const { username, password } = req.body;
  //
  //   const user = await User.findOne({ username });
  //   const email = await User.findOne({ email: username });
  //
  //   if (!user || !email) {
  //     throw new Error(ERROR_MESSAGES.INVALID_USERNAME);
  //   }
  //
  //   // Compare the password
  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //
  //   if (!isPasswordValid) {
  //     throw new Error(ERROR_MESSAGES.INVALID_USERNAME_PASSWORD);
  //   }
  //
  //   // Store the user ID in the session
  //   req.session.userId = user._id;
  //
  //   return res.redirect('/');
  // } catch (error) {
  //   return handleCustomDBError(error, res);
  // }

  try {
    const user = await User.findById('649dc1ea922cb55a934f277c');

    req.session.user = user;

    req.user = user;

    res.redirect('/');
  } catch (e) {
    handleCustomDBError(e, res);
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
