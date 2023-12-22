import { NextFunction, Request, Response } from 'express';
import ApiError from './api-error';
import { STATUS_CODES } from '../constants';

export const errorHandler = (
  error: Error | ApiError,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (!error) return next();

  const status =
    error instanceof ApiError
      ? error.status
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ ...error, message, status });
};
