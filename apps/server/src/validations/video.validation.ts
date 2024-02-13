import z from 'zod';
import fileSchema from './multer.validation';
import {
  objectIdSchema,
  paginationSchema,
  sortOptions,
} from './utils.validation';

export const videoIdSchema = objectIdSchema('Video');

const videoSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(25),
  isPublished: z.coerce.boolean().optional(),
});

export const uploadVideoSchema = z.object({
  body: videoSchema.strict().transform(({ isPublished, ...rest }) => ({
    ...rest,
    isPublished: isPublished || false,
  })),
  files: z.object({
    video: z.array(fileSchema).min(1).max(1),
    thumbnail: z.array(fileSchema).min(1).max(1),
  }),
});

export const getVideoSchema = z.object({
  params: z.object({
    videoId: videoIdSchema,
  }),
});

export const updateVideoSchema = z.object({
  body: videoSchema
    .partial()
    .strict()
    .refine((body) => Object.keys(body).length !== 0, {
      path: ['body'],
      message: 'Request body is empty.',
    }),
  params: z.object({
    videoId: videoIdSchema,
  }),
});

export const deleteVideoSchema = z.object({
  params: z.object({
    videoId: videoIdSchema,
  }),
});

export const getVideoCommentsSchema = z.object({
  params: z.object({
    videoId: videoIdSchema,
  }),
  query: paginationSchema,
});

export const getVideosSchema = z.object({
  query: z
    .object({
      sort: sortOptions,
      query: z.string().default(''),
      username: z.string().optional(),
    })
    .merge(paginationSchema),
});

export const addCommentToVideoSchema = z.object({
  params: z.object({
    videoId: videoIdSchema,
  }),
  body: z.object({
    content: z.string().min(3),
  }),
});

export const toggleVideoLikeSchema = z.object({
  params: z.object({
    videoId: videoIdSchema,
  }),
});

export const changeVideoThumbnailSchema = z.object({
  params: z.object({
    videoId: videoIdSchema,
  }),
  file: fileSchema,
});

export const getStatusSchema = z.object({
  params: z.object({
    videoId: videoIdSchema,
  }),
});
