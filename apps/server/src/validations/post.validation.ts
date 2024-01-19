import z from 'zod';
import fileSchema from './multer.validation';
import { objectIdSchema, paginationSchema } from './utils.validation';
import { commentSchema } from './comment.validation';

const postIdSchema = objectIdSchema('Post');

const postSchema = z.object({
  content: z.string().min(10),
});

export const uploadPostSchema = z.object({
  body: postSchema.strict(),
  files: z.array(fileSchema),
});

export const getPostSchema = z.object({
  params: z.object({
    postId: postIdSchema,
  }),
});

export const getPostsSchema = z.object({
  query: paginationSchema,
});

export const deletePostSchema = z.object({
  params: z.object({
    postId: postIdSchema,
  }),
});

export const addCommentToPostSchema = z.object({
  params: z.object({
    postId: postIdSchema,
  }),
  body: commentSchema,
});

export const getPostCommentsSchema = z.object({
  params: z.object({
    postId: postIdSchema,
  }),
  query: paginationSchema,
});

export const togglePostLikeSchema = z.object({
  params: z.object({
    postId: postIdSchema,
  }),
});

export const updatePostSchema = z.object({
  body: postSchema.strict(),
  params: z.object({
    postId: postIdSchema,
  }),
});

export const changePostImagesSchema = z
  .object({
    files: z.array(fileSchema).min(1).max(4),
    body: z
      .object({
        replaceWithIds: z.array(z.string()),
      })
      .strict(),
    params: z.object({
      postId: postIdSchema,
    }),
  })
  .refine(({ files, body }) => body.replaceWithIds.length == files.length, {
    path: ['body'],
    message: 'files and replaceWith should be of equal size.',
  });
