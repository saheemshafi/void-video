import jwt from 'jsonwebtoken';
import ApiError from '../utils/api-error';
import { User } from '../models/user.model';
import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../constants';

export const authorize =
  (ignoreUnauthorized: boolean = false) =>
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token =
        req.signedCookies['token'] ||
        req.header('Authorization')?.replace('Bearer ', '');

      if (!ignoreUnauthorized && !token) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized.');
      }

      const verifiedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );

      const user = await User.findById(
        typeof verifiedToken !== 'string' && verifiedToken.id
      );

      if (!ignoreUnauthorized && !user) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized.');
      }

      req.user = user || undefined;
      next();
    } catch (error) {
      next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          error instanceof Error ? error.message : ''
        )
      );
    }
  };
