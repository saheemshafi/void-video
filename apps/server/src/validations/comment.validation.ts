import z from 'zod';
import { objectIdSchema } from './utils.validation';

export const commentIdSchema = objectIdSchema('Comment');

export const commentSchema = z.object({
  content: z.string().min(3),
});

export const toggleCommentLikeSchema = z.object({
  params: z.object({
    commentId: commentIdSchema,
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    commentId: commentIdSchema,
  }),
});

export const updateCommentSchema = z.object({
  params: z.object({
    commentId: commentIdSchema,
  }),
  body: commentSchema,
});

export const replyToCommentSchema = z.object({
  params: z.object({
    commentId: commentIdSchema,
  }),
  body: commentSchema,
});
