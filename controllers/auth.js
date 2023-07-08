exports.getSignUp = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign Up',
  });
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
  });
};
