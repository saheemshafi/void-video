import z from 'zod';
import fileSchema from './multer.validation';
import { objectIdSchema, paginationSchema } from './utils.validation';
import { videoIdSchema } from './video.validation';

export const userIdSchema = objectIdSchema('User');

const userSchema = z.object({
  displayName: z.string().min(3),
  username: z.string().min(6).toLowerCase(),
  email: z.string().email(),
});

const passwordSchema = z.string().min(8);

export const createAccountSchema = z.object({
  body: userSchema.merge(z.object({ password: passwordSchema })).strict(),
  files: z.object({
    avatar: z.array(fileSchema).min(1).max(1),
  }),
});

export const loginSchema = z.object({
  body: userSchema
    .omit({ displayName: true })
    .partial()
    .merge(z.object({ password: passwordSchema }))
    .strict()
    .refine((body) => [body.email, body.username].some(Boolean), {
      path: ['body'],
      message: 'Username or email required.',
    }),
});

export const revalidateSessionSchema = z.object({
  signedCookies: z.object({
    'refresh-token': z.string(),
  }),
});

export const emailPasswordResetLinkSchema = z.object({
  body: userSchema.pick({ email: true }).strict(),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string(),
      password: passwordSchema,
    })
    .strict(),
});

export const changeAvatarSchema = z.object({
  file: fileSchema,
});

export const changeBannerSchema = z.object({
  file: fileSchema,
});

export const getChannelProfileSchema = z.object({
  params: userSchema.pick({ username: true }).strict(),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: passwordSchema,
      newPassword: passwordSchema,
    })
    .strict(),
});

export const addVideoToWatchHistorySchema = z.object({
  body: z
    .object({
      videoId: videoIdSchema,
    })
    .strict(),
});

export const getLikedVideosSchema = z.object({
  query: paginationSchema,
});
