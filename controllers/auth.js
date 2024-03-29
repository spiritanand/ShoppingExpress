const bcrypt = require('bcrypt');
const User = require('../models/user');
const { ERROR_MESSAGES } = require('../constants/constants');

exports.getSignUp = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign Up',
  });
};

exports.postSignUp = async (req, res, next) => {
  try {
    const { username, email, password, type } = req.body;
    const avatar = req.file;

    if (avatar && !avatar?.mimetype?.startsWith('image')) {
      throw new Error(ERROR_MESSAGES.FILE_TYPE);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      type,
      avatar: avatar?.path,
    });

    await user.save();

    req.session.user = user;
    await req.session.save();

    res.redirect('/');
  } catch (e) {
    next(e);
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');
    const email = await User.findOne({ email: username }).select('+password');

    if (!user && !email) {
      throw new Error(ERROR_MESSAGES.INVALID_USERNAME);
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || email?.password
    );

    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_USERNAME_PASSWORD);
    }

    // Store the user ID in the session
    req.session.user = user || email;

    return res.redirect('/');
  } catch (e) {
    return next(e);
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw new Error(err);
    }

    return res.redirect('/');
  });
};

exports.getResetPassword = (req, res) => {
  res.render('auth/reset-password', {
    title: 'Reset Password',
  });
};

exports.postResetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword)
      throw new Error(ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH);

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      req.session.user.password
    );

    if (!isPasswordValid) throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await User.findById(req.session.user._id);
    user.password = hashedPassword;
    await user.save();

    res.redirect('/');
  } catch (e) {
    next(e);
  }
};
