const { handleSequelizeError } = require('../controllers/error');
const { ERROR_MESSAGES } = require('../constants/constants');

function handleUnauthorizedUser(e, res) {
  handleSequelizeError(
    e,
    res,
    401,
    `User not logged in`,
    ERROR_MESSAGES.UNAUTHORIZED_ACCESS
  );
}

function handleResourceNotFound(e, res) {
  handleSequelizeError(
    e,
    res,
    404,
    ERROR_MESSAGES.RESOURCE_NOT_FOUND,
    e.message
  );
}

function handleCustomSequelizeError(e, res) {
  if (e.message === ERROR_MESSAGES.UNAUTHORIZED_ACCESS)
    handleUnauthorizedUser(e, res);
  else if (
    e.message === ERROR_MESSAGES.PRODUCT_NOT_FOUND ||
    ERROR_MESSAGES.ORDER_NOT_FOUND ||
    ERROR_MESSAGES.RESOURCE_NOT_FOUND
  )
    handleResourceNotFound(e, res);
  else handleSequelizeError(e, res);
}

module.exports = {
  handleUnauthorizedUser,
  handleResourceNotFound,
  handleCustomSequelizeError,
};
