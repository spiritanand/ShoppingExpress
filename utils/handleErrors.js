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
  if (e.message === ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
    handleInternalServerError(e, res);
  else if (
    e.message === ERROR_MESSAGES.INVALID_USERNAME ||
    e.message === ERROR_MESSAGES.UNAUTHORIZED_ACCESS ||
    e.message === ERROR_MESSAGES.NOT_LOGGED_IN ||
    e.message === ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH ||
    e.message === ERROR_MESSAGES.INVALID_PASSWORD
  )
    handleUnauthenticatedUser(e, res);
  else if (
    e.message === ERROR_MESSAGES.PRODUCT_NOT_FOUND ||
    ERROR_MESSAGES.ORDER_NOT_FOUND ||
    ERROR_MESSAGES.RESOURCE_NOT_FOUND
  )
    handleResourceNotFound(e, res);
  else handleCustomError(e, res);
}

module.exports = {
  handleCustomDBError,
};
