const STATUS = {
  SUCCESS: 'success',
  PENDING: 'processing',
  CANCELLED: 'cancelled',
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
  // DATABASE_ERROR: 'Database error',
  // INVALID_REQUEST: 'Invalid request',
  // INVALID_INPUT: 'Invalid input',
  // DUPLICATE_ENTRY: 'Duplicate entry',
  // OPERATION_NOT_ALLOWED: 'Operation not allowed',
};

module.exports = {
  STATUS,
  ERROR_MESSAGES,
};
