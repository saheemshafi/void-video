import asyncHandler from '../utils/async-handler';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import { User } from '../models/user.model';
import uploadToCloudinary, { mapToFileObject } from '../utils/cloudinary';
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from '../utils/email';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

type IUserFiles =
  | {
      avatar?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    }
  | undefined;

/**
 * POST `/auth/create-account`
 * Controller for registering a new user.
 */
const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const { displayName, username, email, password } = req.body;

  if (![displayName, username, email, password].every(Boolean)) {
    throw new ApiError(400, 'All fields are required.');
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });

  if (userExists) {
    throw new ApiError(409, 'username or email already exists.');
  }

  const tempAvatarPath = (<IUserFiles>req.files)?.avatar?.[0]?.path;
  const tempBannerPath = (<IUserFiles>req.files)?.banner?.[0]?.path;

  if (!tempAvatarPath) {
    throw new ApiError(400, 'Avatar is required.');
  }

  const uploads = [uploadToCloudinary(tempAvatarPath, { folder: 'avatars' })];
  if (tempBannerPath) {
    uploads.push(uploadToCloudinary(tempBannerPath, { folder: 'banners' }));
  }

  const [avatarUploadResponse, bannerUploadResponse] =
    await Promise.allSettled(uploads);

  if (avatarUploadResponse?.status == 'rejected') {
    throw new ApiError(500, 'Failed to upload avatar.');
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
    throw new ApiError(500, 'Failed to create account.');
  }

  res.status(201).json(new ApiResponse(201, 'Account created.', createdUser));
});

/**
 * POST `/auth/login`
 * Controller for logging a user in.
 */
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (![email, password].every(Boolean)) {
    throw new ApiError(400, 'Email or password not provided.');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(404, 'Account doesn\'t exist.');
  }

  const passwordsMatch = await user.comparePasswords(password);
  if (!passwordsMatch) {
    throw new ApiError(401, 'Invalid credentials provided.');
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
    .status(200)
    .json(
      new ApiResponse(200, 'Authenticated successfully.', {
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
  res.status(200).json(new ApiResponse(200, 'Session verified.', req.user));
});

/**
 * GET `/auth/logout`
 * Controller for logging a user out.
 */
const logout = asyncHandler(async (req: Request, res: Response) => {
  res
    .clearCookie('token')
    .clearCookie('refresh-token')
    .status(200)
    .json(new ApiResponse(200, 'Logged out.', null));
});

/*
 * GET auth/session/revalidate
 * Controller to revalidate a user session.
 **/
const revalidateSession = asyncHandler(async (req: Request, res: Response) => {
  const incomingToken = req.signedCookies['refresh-token'];

  if (!incomingToken) {
    throw new ApiError(400, 'Refresh token not present.');
  }

  const decodedToken = jwt.verify(
    incomingToken,
    process.env.REFRESH_TOKEN_SECRET as string
  );

  const user = await User.findById(
    typeof decodedToken !== 'string' && decodedToken.id
  );

  if (!user) {
    throw new ApiError(404, 'User does not exist.');
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
    .status(200)
    .json(new ApiResponse(200, 'Session revalidated.', user));
});

/**
 * POST `/auth/forget-password`
 * Controller for sending an password reset email to user.
 */
const emailPasswordResetLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'No email provided.');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, 'User not found with the provided email.');
    }

    const resetToken = user.generateResetPasswordToken();

    const resetPasswordUri = `${process.env.FRONTEND_URI}/auth/reset-password?resetToken=${resetToken}`;

    const emailResponse = await sendPasswordResetEmail(user.email, {
      username: user.username,
      avatar: user.avatar,
      resetLink: resetPasswordUri,
    });

    res.status(200).json(
      new ApiResponse(200, 'Password reset link sent.', {
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
    throw new ApiError(400, 'Reset password token missing from body');
  }
  if (!password) {
    throw new ApiError(400, 'Password is missing');
  }

  const decodedToken = jwt.verify(
    token,
    process.env.RESET_TOKEN_SECRET as string
  );

  const user = await User.findById(
    typeof decodedToken !== 'string' && decodedToken.id
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.password = password;
  const updatedUser = await user.save();

  if (!updatedUser) {
    throw new ApiError(500, 'Password reset failed.');
  }

  const emailResponse = await sendPasswordResetSuccessEmail(updatedUser.email, {
    avatar: updatedUser.avatar,
    username: updatedUser.username,
  });

  res.status(200).json(
    new ApiResponse(200, 'Password reset successfull.', {
      user: { ...updatedUser.toObject(), password: undefined },
      messageId: emailResponse.messageId,
    })
  );
});

export {
  createAccount,
  login,
  getSession,
  revalidateSession,
  logout,
  emailPasswordResetLink,
  resetPassword,
};
