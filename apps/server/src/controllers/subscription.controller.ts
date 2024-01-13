import { Types } from 'mongoose';
import { STATUS_CODES } from '../constants';
import { Subscription } from '../models/subscription.model';
import { User } from '../models/user.model';
import { validateRequest } from '../utils';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import {
  createSubscriptionValidation,
  removeSubscriptionValidation,
} from '../validations/subscription.validation';

const createSubscription = asyncHandler(async (req, res) => {
  const {
    params: { channelId },
  } = validateRequest(req, createSubscriptionValidation);

  if (req.user?._id.equals(new Types.ObjectId(channelId))) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'Cannot subscribe to yourself.');
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Channel not found.');
  }

  const subscriptionExists = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (subscriptionExists) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'Already subscribed.');
  }

  const subscription = await Subscription.create({
    channel: channel._id,
    subscriber: req.user?._id,
  });

  if (!subscription) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Subscription failed.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'Subscription added.', subscription)
    );
});

const removeSubscription = asyncHandler(async (req, res) => {
  const {
    params: { channelId },
  } = validateRequest(req, removeSubscriptionValidation);

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Channel not found.');
  }

  const subscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user?._id,
  });

  if (!subscription) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Subscription not found.');
  }

  const deleteStatus = await subscription.deleteOne();

  if (!deleteStatus.acknowledged) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to remove subscription.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'Removed subscription.', subscription)
    );
});

export { createSubscription, removeSubscription };