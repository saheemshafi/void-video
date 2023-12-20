import jwt from 'jsonwebtoken';
import ApiError from '../utils/api-error';
import { User } from '../models/user.model';
import { NextFunction, Request, Response } from 'express';

export const authorize = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.signedCookies['token'] ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized.');
    }
    const verifiedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    const user = await User.findById(
      typeof verifiedToken !== 'string' && verifiedToken.id
    );

    if (!user) {
      throw new ApiError(401, 'Unauthorized.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error instanceof Error ? error.message : ''));
  }
};
