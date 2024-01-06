import { ErrorHandler } from '../utils/errorHandler.js';

export default function (err, req, res, next) {
  //Wrong Mongodb Id error(like wrong mongodb id)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web Token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }
  //JWT EXPIRED error
  if (err.name === 'TokenExpiredError') {
    const message = `Json Web Token is Expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  return res.status(500).json({
    success: false,
    error: err.message,
    //or  error: err.stack,
    //or error: err,
  });
}
