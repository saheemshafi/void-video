import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../constants';
import { User } from '../models/user.model';
import { validateRequest } from '../utils';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import uploadToCloudinary, { mapToFileObject } from '../utils/cloudinary';
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from '../utils/email';
import { createAccountValidation } from '../validations/auth.validation';

/**
 * POST `/auth/create-account`
 * Controller for registering a new user.
 */
const createAccount = asyncHandler(async (req: Request, res: Response) => {

  const validation = validateRequest(req, createAccountValidation);

  if (!validation.success) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Failed to validate request.',
      validation.errors
    );
  }

  const {
    body: { displayName, username, email, password },
    files: { avatar, banner },
  } = validation.data;

  const userExists = await User.findOne({ $or: [{ username }, { email }] });

  if (userExists) {
    throw new ApiError(
      STATUS_CODES.CONFLICT,
      'username or email already exists.'
    );
  }

  const tempAvatarPath = avatar[0]?.path;
  const tempBannerPath = banner[0]?.path;

  if (!tempAvatarPath) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Avatar is required.');
  }

  const uploads = [
    uploadToCloudinary(tempAvatarPath, { folder: 'avatars' }),
    tempBannerPath
      ? uploadToCloudinary(tempBannerPath, { folder: 'banners' })
      : undefined,
  ];

  const [avatarUploadResponse, bannerUploadResponse] =
    await Promise.allSettled(uploads);

  if (avatarUploadResponse?.status == 'rejected') {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to upload avatar.'
    );
  }

  const user = await User.create({
    displayName,
    username,
    email,
    password,
    avatar: mapToFileObject(avatarUploadResponse?.value),
    banner:
      bannerUploadResponse?.status == 'fulfilled'
        ? mapToFileObject(bannerUploadResponse.value)
        : null,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to create account.'
    );
  }

  res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(STATUS_CODES.CREATED, 'Account created.', createdUser)
    );
});

/**
 * POST `/auth/login`
 * Controller for logging a user in.
 */
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (![email, password].every(Boolean)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Email or password not provided.'
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Account does not exist.');
  }

  const passwordsMatch = await user.comparePasswords(password);
  if (!passwordsMatch) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      'Invalid credentials provided.'
    );
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res
    .cookie('token', accessToken, {
      httpOnly: true,
      signed: true,
    })
    .cookie('refresh-token', refreshToken, {
      httpOnly: true,
      signed: true,
    })
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'Authenticated successfully.', {
        user: { ...user.toObject(), password: undefined },
        accessToken,
        refreshToken,
      })
    );
});

/**
 * GET `/auth/session`
 * Controller for retrieving a user session.
 */
const getSession = asyncHandler(async (req: Request, res: Response) => {
  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Session verified.', req.user));
});

/**
 * GET `/auth/logout`
 * Controller for logging a user out.
 */
const logout = asyncHandler(async (req: Request, res: Response) => {
  res
    .clearCookie('token')
    .clearCookie('refresh-token')
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Logged out.', null));
});

/*
 * GET auth/session/revalidate
 * Controller to revalidate a user session.
 **/
const revalidateSession = asyncHandler(async (req: Request, res: Response) => {
  const incomingToken = req.signedCookies['refresh-token'];

  if (!incomingToken) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Refresh token not present.');
  }

  const decodedToken = jwt.verify(
    incomingToken,
    process.env.REFRESH_TOKEN_SECRET as string
  );

  const user = await User.findById(
    typeof decodedToken !== 'string' && decodedToken.id
  );

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User does not exist.');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const cookieOptions = {
    httpOnly: true,
    signed: true,
  };

  res
    .cookie('token', accessToken, cookieOptions)
    .cookie('refresh-token', refreshToken, cookieOptions)
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Session revalidated.', user));
});

/**
 * POST `/auth/forget-password`
 * Controller for sending an password reset email to user.
 */
const emailPasswordResetLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'No email provided.');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        'User not found with the provided email.'
      );
    }

    const resetToken = user.generateResetPasswordToken();

    const resetPasswordUri = `${process.env.FRONTEND_URI}/auth/reset-password?resetToken=${resetToken}`;

    const emailResponse = await sendPasswordResetEmail(user.email, {
      username: user.username,
      avatar: user.avatar,
      resetLink: resetPasswordUri,
    });

    res.status(STATUS_CODES.OK).json(
      new ApiResponse(STATUS_CODES.OK, 'Password reset link sent.', {
        messageId: emailResponse.messageId,
      })
    );
  }
);

/**
 * POST `/auth/reset-password`
 * Controller for resetting user password.
 */
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Reset password token missing from body'
    );
  }
  if (!password) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Password is missing');
  }

  const decodedToken = jwt.verify(
    token,
    process.env.RESET_TOKEN_SECRET as string
  );

  const user = await User.findById(
    typeof decodedToken !== 'string' && decodedToken.id
  );

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }

  user.password = password;
  const updatedUser = await user.save();

  if (!updatedUser) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Password reset failed.'
    );
  }

  const emailResponse = await sendPasswordResetSuccessEmail(updatedUser.email, {
    avatar: updatedUser.avatar,
    username: updatedUser.username,
  });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, 'Password reset successfull.', {
      user: { ...updatedUser.toObject(), password: undefined },
      messageId: emailResponse.messageId,
    })
  );
});

export {
  createAccount,
  emailPasswordResetLink,
  getSession,
  login,
  logout,
  resetPassword,
  revalidateSession,
};
