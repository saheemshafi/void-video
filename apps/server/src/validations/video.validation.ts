import z from 'zod';
import fileValidation from './multer.validation';
import { objectIdValidation, paginationValidation } from './utils.validation';

export const uploadVideoValidation = z.object({
  body: z
    .object({
      title: z.string().min(10),
      description: z.string().min(25),
      isPublished: z.coerce.boolean().optional().default(false),
    })
    .strict(),
  files: z.object({
    video: z.array(fileValidation).min(1).max(1),
    thumbnail: z.array(fileValidation).min(1).max(1),
  }),
});

export const getVideoValidation = z.object({
  params: z.object({
    videoId: objectIdValidation('Video'),
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
    .refine((body) => Object.keys(body).length !== 0, {
      path: ['body'],
      message: 'Request body is empty.',
    }),
  params: z.object({
    videoId: objectIdValidation('Video'),
  }),
});

export const deleteVideoValidation = z.object({
  params: z.object({
    videoId: objectIdValidation('Video'),
  }),
});

export const getVideoCommentsValidation = z.object({
  params: z.object({
    videoId: objectIdValidation('Video'),
  }),
  query: paginationValidation,
});

export const videoSortOptions = z
  .enum(['views.asc', 'views.desc', 'title.asc', 'title.desc'])
  .default('title.asc');

export const getVideosValidation = z.object({
  query: paginationValidation.extend({ sort: videoSortOptions }),
});

export const addCommentToVideoValidation = z.object({
  params: z.object({
    videoId: objectIdValidation('Video'),
  }),
  body: z.object({
    content: z.string().min(3),
  }),
});

export const toggleVideoLikeValidation = z.object({
  params: z.object({
    videoId: objectIdValidation('Video'),
  }),
});

export const changeVideoThumbnailValidation = z.object({
  params: z.object({
    videoId: objectIdValidation('Video'),
  }),
  file: fileValidation,
});
