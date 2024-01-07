import { validateRequest } from '../utils';
import asyncHandler from '../utils/async-handler';
import {
  createSubscriptionValidation,
  removeSubscriptionValidation,
} from '../validations/subscription.validation';

const createSubscription = asyncHandler(async (req, res) => {
  const {
    body: { channelId },
  } = validateRequest(req, createSubscriptionValidation);
});

const removeSubscription = asyncHandler(async (req, res) => {
  const {
    body: { channelId },
  } = validateRequest(req, removeSubscriptionValidation);
});

export { createSubscription, removeSubscription };
