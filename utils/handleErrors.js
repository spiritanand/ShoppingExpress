const { handleSequelizeError } = require('../controllers/error');
const { ERROR_MESSAGES } = require('../constants/constants');

function handleNotLoggedInUser(e, res) {
  handleSequelizeError(e, res, 401, ERROR_MESSAGES.NOT_LOGGED_IN);
}

function handleResourceNotFound(e, res) {
  handleSequelizeError(e, res, 404, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
}

function handleInternalServerError(e, res) {
  handleSequelizeError(e, res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
}

function handleCustomDBError(e, res) {
  if (e.message === ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
    handleInternalServerError(e, res);
  else if (e.message === ERROR_MESSAGES.NOT_LOGGED_IN)
    handleNotLoggedInUser(e, res);
  else if (
    e.message === ERROR_MESSAGES.PRODUCT_NOT_FOUND ||
    ERROR_MESSAGES.ORDER_NOT_FOUND ||
    ERROR_MESSAGES.RESOURCE_NOT_FOUND
  )
    handleResourceNotFound(e, res);
  else handleSequelizeError(e, res);
}

module.exports = {
  handleCustomDBError,
};
