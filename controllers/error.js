const { ERROR_MESSAGES } = require('../constants/constants');

const renderErrorView = (
  res,
  status = 404,
  title = '404 Page Not Found',
  message = ERROR_MESSAGES.PAGE_NOT_FOUND
) => {
  res.status(status).render('error', {
    title,
    path: '',
    errorStatus: status,
    message,
  });
};

exports.get404 = (req, res) => {
  renderErrorView(res);
};

exports.handleSequelizeError = (e, res, status, title, message) => {
  console.log('Error: ', e?.message);

  renderErrorView(res, status, title, message);
};
