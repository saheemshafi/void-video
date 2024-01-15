import z from 'zod';
import fileValidation from './multer.validation';
import { objectIdValidation, paginationValidation } from './utils.validation';

export const createAccountValidation = z.object({
  body: z
    .object({
      displayName: z.string().min(3),
      username: z.string().min(6).toLowerCase(),
      email: z.string().email(),
      password: z.string().min(8),
    })
    .strict(),
  files: z.object({
    avatar: z.array(fileValidation).min(1).max(1),
  }),
});

export const loginValidation = z.object({
  body: z
    .object({
      username: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string(),
    })
    .strict()
    .refine((body) => [body.email, body.username].some(Boolean), {
      path: ['body'],
      message: 'Username or email required.',
    }),
});

export const revalidateSessionValidation = z.object({
  signedCookies: z.object({
    'refresh-token': z.string(),
  }),
});

export const emailPasswordResetLinkValidation = z.object({
  body: z
    .object({
      email: z.string().email(),
    })
    .strict(),
});

export const resetPasswordValidation = z.object({
  body: z
    .object({
      token: z.string(),
      password: z.string().min(8),
    })
    .strict(),
});

export const changeAvatarValidation = z.object({
  file: fileValidation,
});

export const changeBannerValidation = z.object({
  file: fileValidation,
});

export const getChannelProfileValidation = z.object({
  params: z
    .object({
      username: z.string(),
    })
    .strict(),
});

export const changePasswordValidation = z.object({
  body: z
    .object({
      oldPassword: z.string().min(8),
      newPassword: z.string().min(8),
    })
    .strict(),
});

export const addVideoToWatchHistoryValidation = z.object({
  body: z
    .object({
      videoId: objectIdValidation('Video'),
    })
    .strict(),
});

export const getLikedVideosValidation = z.object({
  query: paginationValidation,
});
