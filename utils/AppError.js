class AppError extends Error {
  constructor(message, statusCode, name = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    this.message = message;
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
