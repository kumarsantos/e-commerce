import userSchema from '../models/userModel.js';
import { customError } from '../utils/errorHandler.js';
import catchAsyncErrors from './catchAsyncErrors.js';
import jwt from 'jsonwebtoken';

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return next(customError('Please login to access this resource.', 401));
  }

  token = token.split(' ');

  if (!token && token.length > 1) {
    return next(customError('Invalid token please login first.', 403));
  }

  const decodedData = jwt.verify(token[1], process.env.JWT_SECRET);
  req.user = await userSchema.findById(decodedData.id);
  next();
});

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        customError(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
