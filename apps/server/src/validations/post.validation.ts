import z from 'zod';
import fileValidation from './multer.validation';
import { isValidObjectId } from 'mongoose';

export const postIdValidation = z
  .string()
  .refine((postId) => isValidObjectId(postId), {
    path: ['postId'],
    message: 'Post id is not valid.',
  });

export const uploadPostValidation = z.object({
  body: z
    .object({
      content: z.string().min(10),
    })
    .strict(),
  files: z.array(fileValidation),
});

export const getPostValidation = z.object({
  params: z.object({
    postId: postIdValidation,
  }),
});

export const getPostsValidation = z.object({
  query: z.object({
    limit: z.coerce.number().gte(10).default(10),
    page: z.coerce.number().gte(0).default(1),
  }),
});
