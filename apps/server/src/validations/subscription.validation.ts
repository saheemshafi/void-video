import z from 'zod';
import { objectIdValidation } from './utils.validation';

export const createSubscriptionValidation = z.object({
  params: z.object({
    channelId: objectIdValidation('User'),
  }),
});

export const removeSubscriptionValidation = z.object({
  params: z.object({
    channelId: objectIdValidation('User'),
  }),
});
