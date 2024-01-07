import z from 'zod';
import { objectIdValidation } from './utils.validation';

export const createSubscriptionValidation = z.object({
  body: z.object({
    channelId: objectIdValidation('User'),
  }),
});

export const removeSubscriptionValidation = z.object({
  body: z.object({
    channelId: objectIdValidation('User'),
  }),
});
