const STATUS = {
  SUCCESS: 'success',
  PROCESSED: 'processing',
  CANCELLED: 'cancelled',
};

const ERROR_MESSAGES = {
  PAGE_NOT_FOUND: 'Page Not Found',
  RESOURCE_NOT_FOUND: 'Resource not found',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  PRODUCT_NOT_FOUND: 'No Product(s) found',
  ORDER_NOT_FOUND: 'No Order(s) found',
  // INVALID_REQUEST: 'Invalid request',
  // INTERNAL_SERVER_ERROR: 'Internal server error',
  // INVALID_INPUT: 'Invalid input',
  // DUPLICATE_ENTRY: 'Duplicate entry',
  // DATABASE_ERROR: 'Database error',
  // OPERATION_NOT_ALLOWED: 'Operation not allowed',
};

module.exports = {
  STATUS,
  ERROR_MESSAGES,
};
