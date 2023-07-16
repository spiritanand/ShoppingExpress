const { handleCustomError } = require('../controllers/error');
const { ERROR_MESSAGES } = require('../constants/constants');

function handleUnauthenticatedUser(e, res) {
  handleCustomError(e, res, 401, e.message);
}

function handleResourceNotFound(e, res) {
  handleCustomError(e, res, 404, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
}

function handleInternalServerError(e, res) {
  handleCustomError(e, res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
}

function handleCustomDBError(e, res) {
  switch (e.message) {
    case ERROR_MESSAGES.INTERNAL_SERVER_ERROR:
      handleInternalServerError(e, res);
      break;
    case ERROR_MESSAGES.INVALID_USERNAME:
    case ERROR_MESSAGES.UNAUTHORIZED_ACCESS:
    case ERROR_MESSAGES.NOT_LOGGED_IN:
    case ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH:
    case ERROR_MESSAGES.INVALID_PASSWORD:
      handleUnauthenticatedUser(e, res);
      break;
    case ERROR_MESSAGES.PRODUCT_NOT_FOUND:
    case ERROR_MESSAGES.ORDER_NOT_FOUND:
    case ERROR_MESSAGES.RESOURCE_NOT_FOUND:
      handleResourceNotFound(e, res);
      break;
    default:
      handleCustomError(e, res);
      break;
  }
}

module.exports = {
  handleCustomDBError,
};
