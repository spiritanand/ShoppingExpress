const STATUS = {
  SUCCESS: 'success',
  PENDING: 'processing',
  CANCELLED: 'cancelled',
};

const USER_TYPE = {
  ADMIN: 'admin',
  USER: 'user',
};

const ERROR_MESSAGES = {
  PAGE_NOT_FOUND: 'Page Not Found',
  RESOURCE_NOT_FOUND: 'Resource not found',
  PRODUCT_NOT_FOUND: 'No Product(s) found',
  ORDER_NOT_FOUND: 'No Order(s) found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  NOT_LOGGED_IN: 'User not logged in',
  INVALID_USERNAME: 'Invalid username',
  INVALID_USERNAME_PASSWORD: 'Invalid username or password',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  INVALID_PASSWORD: 'Invalid password. Please try again.',
  FILE_TYPE: 'Invalid file type',
};

const ERROR_TITLE = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  UNAUTHORIZED: 'Unauthorized',
};

module.exports = {
  STATUS,
  USER_TYPE,
  ERROR_MESSAGES,
  ERROR_TITLE,
};
