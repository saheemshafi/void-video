import jwt from 'jsonwebtoken';
import ApiError from '../utils/api-error';
import { IUser, User } from '../models/user.model';
import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../constants';
import redis from '../db/redis';

export const authorize =
  (ignoreUnauthorized: boolean = false) =>
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token =
        req.signedCookies['token'] ||
        req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized.');
      }

      const verifiedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );

      const userId = typeof verifiedToken !== 'string' && verifiedToken.id;

      const cachedUser = await redis.get(`session:${userId}`);

      let user: undefined | null | IUser;

      if (cachedUser) {
        user = new User(JSON.parse(cachedUser));
      } else {
        user = await User.findById(userId);
        redis.set(`session:${userId}`, JSON.stringify(user));
      }

      if (!user) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized.');
      }

      req.user = user;
      next();
    } catch (error) {
      if (ignoreUnauthorized) return next();
      next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          error instanceof Error ? error.message : ''
        )
      );
    }
  };
