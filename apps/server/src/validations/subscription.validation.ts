import z from 'zod';
import { userIdValidation } from './user.validation';

export const createSubscriptionValidation = z.object({
  body: z.object({
    channelId: userIdValidation,
  }),
});

export const removeSubscriptionValidation = z.object({
  body: z.object({
    channelId: userIdValidation,
  }),
});
