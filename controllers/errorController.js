const AppError = require('./../utils/AppError');

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}:${err.value}`, 400);
};
const handleValidationErrorUrl = (err) => {
  return new AppError(
    "Pls enter a valid URL , don't forget to add protocols (http , https)",
    400
  );
};
//function to return duplicate fields error
const handleDuplicateFieldsDB = (err) => {
  return new AppError(
    `${
      err.keyValue.name || err.keyValue.email
    } is already registered..Please try another value`,
    400
  );
};
const PasswordNotSameError = (err) => {
  return new AppError("passwords don't match", 400);
};
//function to return validation error in production
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`${errors.join('. ')} , `, 400);
};

//function to return jwt error in production
const handleJWTError = () => {
  return new AppError(
    'Invalid Token | Please Log in again',
    401,
    'JsonWebTokenError'
  );
};

//function to return error if token expires in production
const handleJWTExpiredError = () => {
  return new AppError('Ur Token has expired | Please Log in again', 401);
};

const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};
const sendErrProd = (err, req, res) => {
  //sending errors if they are operational
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //sending generic error message if error was not operational
    // eslint-disable-next-line no-console
    console.error('ERROR 🤞🤞🤞', err);
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  //setting default error codes if not declared
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //sending errors in production
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'development'
  ) {
    let error = { ...err };
    error.message = err.message;
    console.log(err);
    // sending errors for invalid mongodb ids
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    else if (error.message.includes('passwordConfirm'))
      error = PasswordNotSameError();
    else if (error.message.includes('valid URL'))
      error = handleValidationErrorUrl();
    else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    else if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    else if (error._message === 'User validation failed')
      error = handleValidationErrorDB(error);
    else if (error.name === 'JsonWebTokenError') error = handleJWTError();
    else if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError();
    error.isOperational = true;
    //sending errors in production
    sendErrProd(error, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    //sending errors in development
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrDev(error, req, res);
  }
};
