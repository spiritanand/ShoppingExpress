const { ERROR_MESSAGES, ERROR_TITLE } = require('../constants/constants');
const { renderErrorView } = require('../controllers/error');

exports.handleCustomDBError = (e, res) => {
  switch (e.message) {
    case ERROR_MESSAGES.INTERNAL_SERVER_ERROR:
      renderErrorView(res, 500, ERROR_TITLE.INTERNAL_SERVER_ERROR, e.message);
      break;
    case ERROR_MESSAGES.FILE_TYPE:
      renderErrorView(res, 422, ERROR_TITLE.UNPROCESSABLE_ENTITY, e.message);
      break;
    case ERROR_MESSAGES.NOT_LOGGED_IN:
    case ERROR_MESSAGES.UNAUTHORIZED_ACCESS:
    case ERROR_MESSAGES.INVALID_USERNAME:
    case ERROR_MESSAGES.INVALID_USERNAME_PASSWORD:
    case ERROR_MESSAGES.INVALID_PASSWORD:
    case ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH:
      renderErrorView(res, 401, ERROR_TITLE.UNAUTHORIZED, e.message);
      break;
    default:
      renderErrorView(res);
      break;
  }
};
