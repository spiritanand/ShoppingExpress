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

exports.handleCustomError = (e, res, status, title) => {
  // eslint-disable-next-line no-console
  console.error('Error:', e?.message);

  renderErrorView(res, status, title, e.message);
};

exports.renderErrorView = renderErrorView;
