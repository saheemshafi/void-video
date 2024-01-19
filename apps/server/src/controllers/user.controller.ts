import { CookieOptions, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PaginateOptions, Types } from 'mongoose';
import { STATUS_CODES, cookieOptions } from '../constants';
import {
  $lookupLikes,
  $lookupSubscriptions,
  $lookupUserDetails,
  $lookupVideoDetails,
} from '../db/aggregations';
import { Subscription } from '../models/subscription.model';
import { User } from '../models/user.model';
import { Video } from '../models/video.model';
import { validateRequest } from '../utils';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import {
  mapToFileObject,
  removeFilesFromCloudinary,
  uploadFileToCloudinary,
} from '../utils/cloudinary';
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from '../utils/email';
import {
  addVideoToWatchHistorySchema,
  changeAvatarSchema,
  changeBannerSchema,
  changePasswordSchema,
  createAccountSchema,
  emailPasswordResetLinkSchema,
  getChannelProfileSchema,
  getLikedVideosSchema,
  loginSchema,
  resetPasswordSchema,
  revalidateSessionSchema,
} from '../validations/user.validation';

const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { displayName, username, email, password },
    files: { avatar },
  } = validateRequest(req, createAccountSchema);

  const userExists = await User.findOne({ $or: [{ username }, { email }] });

  if (userExists) {
    throw new ApiError(
      STATUS_CODES.CONFLICT,
      'username or email already exists.'
    );
  }

  const tempAvatarPath = avatar[0]?.path;

  if (!tempAvatarPath) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Avatar is required.');
  }

  const avatarResponse = await uploadFileToCloudinary(tempAvatarPath, {
    folder: 'avatars',
  });

  if (!avatarResponse) {
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
    avatar: mapToFileObject(avatarResponse),
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

const login = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { username, email, password },
  } = validateRequest(req, loginSchema);

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
    .cookie('token', accessToken, cookieOptions)
    .cookie('refresh-token', refreshToken, cookieOptions)
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'Authenticated successfully.', {
        user: { ...user.toObject(), password: undefined },
        accessToken,
        refreshToken,
      })
    );
});

const getSession = asyncHandler(async (req: Request, res: Response) => {
  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Session verified.', req.user));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  res
    .clearCookie('token', cookieOptions)
    .clearCookie('refresh-token', cookieOptions)
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Logged out.'));
});

const revalidateSession = asyncHandler(async (req, res) => {
  const { signedCookies } = validateRequest(req, revalidateSessionSchema);

  const incomingToken = signedCookies['refresh-token'];

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

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    signed: true,
  };

  res
    .cookie('token', accessToken, cookieOptions)
    .cookie('refresh-token', refreshToken, cookieOptions)
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Session revalidated.', user));
});

const emailPasswordResetLink = asyncHandler(async (req, res) => {
  const {
    body: { email },
  } = validateRequest(req, emailPasswordResetLinkSchema);

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'User not found with the provided email.'
    );
  }

  const resetToken = user.generateResetPasswordToken();

  const resetPasswordUri = `${process.env.FRONTEND_URI}/auth/reset-password?token=${resetToken}`;

  await sendPasswordResetEmail(user.email, {
    username: user.username,
    avatar: user.avatar,
    resetLink: resetPasswordUri,
  });

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Password reset link sent.'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const {
    body: { token, password },
  } = validateRequest(req, resetPasswordSchema);

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

  await sendPasswordResetSuccessEmail(updatedUser.email, {
    avatar: updatedUser.avatar,
    username: updatedUser.username,
  });

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Password reset successfull.'));
});

const changeAvatar = asyncHandler(async (req, res) => {
  const { file: avatar } = validateRequest(req, changeAvatarSchema);

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

  await removeFilesFromCloudinary(req.user?.avatar.public_id || '');

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Changed avatar.', user?.avatar));
});

const changeBanner = asyncHandler(async (req, res) => {
  const { file: banner } = validateRequest(req, changeBannerSchema);

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

  if (req.user?.banner) {
    await removeFilesFromCloudinary(req.user?.banner?.public_id || '');
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Changed banner.', user?.banner));
});

const getChannelProfile = asyncHandler(async (req, res) => {
  const {
    params: { username },
  } = validateRequest(req, getChannelProfileSchema);

  const channel = await User.aggregate([
    {
      $match: {
        username,
      },
    },
    $lookupSubscriptions(),
    $lookupSubscriptions({ foreignField: 'subscriber', as: 'subscriptions' }),
    {
      $addFields: {
        totalSubscribers: {
          $size: '$subscribers',
        },
        totalSubscriptions: {
          $size: '$subscriptions',
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, '$subscribers.subscriber'],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        displayName: 1,
        avatar: 1,
        banner: 1,
        isSubscribed: 1,
        totalSubscribers: 1,
        totalSubscriptions: 1,
      },
    },
  ]);

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'User channel retrieved.', channel[0])
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const {
    body: { oldPassword, newPassword },
  } = validateRequest(req, changePasswordSchema);

  const user = await User.findById(req.user?._id).select('+password');

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  const isPasswordCorrect = await user.comparePasswords(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid old password.');
  }

  user.password = newPassword;

  await user.save();

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Changed password.'));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: req.user?._id,
      },
    },
    $lookupVideoDetails({ localField: 'watchHistory', as: 'watchHistory' }),
  ]);

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        'Watch history retreived.',
        user[0].watchHistory
      )
    );
});

const addVideoToWatchHistory = asyncHandler(async (req, res) => {
  const {
    body: { videoId },
  } = validateRequest(req, addVideoToWatchHistorySchema);

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  const isVideoInWatchHistory = user.watchHistory.some((video) =>
    video.equals(videoId)
  );

  if (isVideoInWatchHistory) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'Video already in watch history');
  }

  user.watchHistory.push(new Types.ObjectId(videoId));

  await user.save();

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        'Video added to watch history.',
        user.watchHistory
      )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new Types.ObjectId(req.user?._id),
      },
    },
    $lookupUserDetails({ localField: 'channel', as: 'channel' }),
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: '$channel',
        },
      },
    },
    $lookupSubscriptions(),
    {
      $addFields: {
        totalSubscribers: {
          $size: '$subscribers',
        },
      },
    },
    {
      $project: {
        username: 1,
        displayName: 1,
        avatar: 1,
        createdAt: 1,
        updatedAt: 1,
        totalSubscribers: 1,
      },
    },
  ]);

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        'Retrieved subscribed channels.',
        subscribedChannels
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const {
    query: { page, limit },
  } = validateRequest(req, getLikedVideosSchema);

  const videosAggregation = Video.aggregate([
    {
      $match: {
        isPublished: true,
      },
    },
    $lookupLikes(),
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: '$likes',
        },
      },
    },
    {
      $match: {
        likedBy: new Types.ObjectId(req.user?._id),
      },
    },
    $lookupVideoDetails({ localField: 'video', as: 'video' }),
    {
      $replaceRoot: {
        newRoot: {
          $first: '$video',
        },
      },
    },
  ]);

  const options: PaginateOptions = { page, limit };

  const { docs, ...paginationData } = await Video.aggregatePaginate(
    videosAggregation,
    options
  );

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, 'Liked videos retrieved.', {
      videos: docs,
      ...paginationData,
    })
  );
});

export {
  addVideoToWatchHistory,
  changeAvatar,
  changeBanner,
  changePassword,
  createAccount,
  emailPasswordResetLink,
  getChannelProfile,
  getLikedVideos,
  getSession,
  getSubscribedChannels,
  getUserWatchHistory,
  login,
  logout,
  resetPassword,
  revalidateSession,
};
