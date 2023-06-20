const STATUS = {
  SUCCESS: 'success',
  PROCESSED: 'processing',
  CANCELLED: 'cancelled',
};

const ERROR_MESSAGES = {
  PAGE_NOT_FOUND: 'Page Not Found',
  RESOURCE_NOT_FOUND: 'Resource not found',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  NOT_LOGGED_IN: 'User not logged in',
  PRODUCT_NOT_FOUND: 'No Product(s) found',
  ORDER_NOT_FOUND: 'No Order(s) found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
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
