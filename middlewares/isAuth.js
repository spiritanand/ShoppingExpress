const { ERROR_MESSAGES, USER_TYPE } = require('../constants/constants');
const { handleCustomDBError } = require('../utils/handleErrors');

exports.isAdmin = (req, res, next) => {
  try {
    if (!req?.user) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);

    if (req?.user?.type !== USER_TYPE.ADMIN)
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);

    next();
  } catch (err) {
    handleCustomDBError(err, res);
  }
};

exports.isLoggedIn = (req, res, next) => {
  try {
    if (!req?.user) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);

    next();
  } catch (err) {
    handleCustomDBError(err, res);
  }
};
