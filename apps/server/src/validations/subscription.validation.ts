import z from 'zod';
import { objectIdValidation } from './utils.validation';

export const toggleSubscriptionValidation = z.object({
  params: z.object({
    channelId: objectIdValidation('User'),
  }),
});
