import z from 'zod';
import { userIdSchema } from './user.validation';

export const toggleSubscriptionSchema = z.object({
  params: z.object({
    channelId: userIdSchema,
  }),
});
