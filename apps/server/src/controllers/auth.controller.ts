import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../constants';
import { User } from '../models/user.model';
import { validateRequest } from '../utils';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import {
  uploadFileToCloudinary,
  removeFileFromCloudinary,
  mapToFileObject,
} from '../utils/cloudinary';
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from '../utils/email';
import {
  changeAvatarValidation,
  changeBannerValidation,
  createAccountValidation,
  emailPasswordResetLinkValidation,
  loginValidation,
  resetPasswordValidation,
} from '../validations/auth.validation';

/**
 * POST `/auth/create-account`
 * Controller for registering a new user.
 */
const createAccount = asyncHandler(async (req: Request, res: Response) => {

  const {
    body: { displayName, username, email, password },
    files: { avatar, banner },
  } = validateRequest(req, createAccountValidation);

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
    uploadFileToCloudinary(tempAvatarPath, { folder: 'avatars' }),
    tempBannerPath
      ? uploadFileToCloudinary(tempBannerPath, { folder: 'banners' })
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
  const {
    body: { username, email, password },
  } = validateRequest(req, loginValidation);

  const user = await User.findOne({ $or: [{ username }, { email }] }).select(
    '+password'
  );

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
    const {
      body: { email },
    } = validateRequest(req, emailPasswordResetLinkValidation);

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
  const {
    body: { token, password },
  } = validateRequest(req, resetPasswordValidation);

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

/**
 * POST `/auth/change-avatar`
 * Controller for changing user avatar.
 */
const changeAvatar = asyncHandler(async (req, res) => {
  const { file: avatar } = validateRequest(req, changeAvatarValidation);

  const avatarUploadResponse = await uploadFileToCloudinary(avatar.path, {
    folder: 'avatars',
  });

  if (!avatarUploadResponse) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to upload avatar.'
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: mapToFileObject(avatarUploadResponse) },
    },
    { new: true }
  );

  await removeFileFromCloudinary(req.user?.avatar.public_id || '');

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Changed avatar.', user?.avatar));
});

/**
 * POST `/auth/change-banner`
 * Controller for changing user banner.
 */
const changeBanner = asyncHandler(async (req, res) => {
  const { file: banner } = validateRequest(req, changeBannerValidation);

  const bannerUploadResponse = await uploadFileToCloudinary(banner.path, {
    folder: 'banners',
  });

  if (!bannerUploadResponse) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to upload banner.'
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { banner: mapToFileObject(bannerUploadResponse) },
    },
    { new: true }
  );

  await removeFileFromCloudinary(req.user?.banner?.public_id || '');

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Changed banner.', user?.banner));
});

export {
  createAccount,
  emailPasswordResetLink,
  getSession,
  login,
  logout,
  resetPassword,
  revalidateSession,
  changeAvatar,
  changeBanner,
};
