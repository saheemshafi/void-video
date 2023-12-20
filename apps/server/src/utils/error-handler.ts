import { NextFunction, Request, Response } from 'express';
import ApiError from './api-error';

export const errorHandler = (
  error: Error | ApiError,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (!error) return next();

  const message = error.message;
  const status = error instanceof ApiError ? error.status : 500;
  const apiError = new ApiError(status, message);

  res.status(status).json({ ...apiError, message });
};
