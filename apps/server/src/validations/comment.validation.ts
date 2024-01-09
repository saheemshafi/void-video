import z from 'zod';
import { objectIdValidation } from './utils.validation';

export const toggleCommentLikeValidation = z.object({
  params: z.object({
    commentId: objectIdValidation('Comment'),
  }),
});

export const deleteCommentValidation = z.object({
  params: z.object({
    commentId: objectIdValidation('Comment'),
  }),
});

export const updateCommentValidation = z.object({
  params: z.object({
    commentId: objectIdValidation('Comment'),
  }),
  body: z.object({
    content: z.string().min(3),
  }),
});
