import z from 'zod';
import fileValidation from './multer.validation';
import { isValidObjectId } from 'mongoose';
import paginationValidation from './pagination.validation';

export const videoIdValidation = z
  .string()
  .refine((videoId) => isValidObjectId(videoId), {
    path: ['videoId'],
    message: 'Video id is not valid.',
  });

export const uploadVideoValidation = z.object({
  body: z
    .object({
      title: z.string().min(10),
      description: z.string().min(25),
      isPublished: z.boolean().optional().default(false),
    })
    .strict(),
  files: z.object({
    video: z.array(fileValidation).min(1).max(1),
    thumbnail: z.array(fileValidation).min(1).max(1),
  }),
});

export const getVideoValidation = z.object({
  params: z.object({
    videoId: videoIdValidation,
  }),
});

export const updateVideoValidation = z.object({
  body: z
    .object({
      title: z.string().min(10).optional(),
      description: z.string().min(25).optional(),
      isPublished: z.boolean().optional(),
    })
    .strict()
    .refine((body) => Object.keys(body).length === 0, {
      path: ['body'],
      message: 'Request body is empty.',
    }),
  params: z.object({
    videoId: videoIdValidation,
  }),
});

export const deleteVideoValidation = z.object({
  params: z.object({
    videoId: videoIdValidation,
  }),
});

export const getVideoCommentsValidation = z.object({
  params: z.object({
    videoId: videoIdValidation,
  }),
  query: paginationValidation,
});

export const getVideosValidation = z.object({
  query: paginationValidation,
});

export const addCommentToVideoValidation = z.object({
  params: z.object({
    videoId: videoIdValidation,
  }),
  body: z.object({
    content: z.string().min(3),
  }),
});

export const likeVideoValidation = z.object({
  params: z.object({
    videoId: videoIdValidation,
  }),
});
