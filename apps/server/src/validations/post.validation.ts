import z from 'zod';
import fileValidation from './multer.validation';
import { isValidObjectId } from 'mongoose';
import paginationValidation from './pagination.validation';

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
  query: paginationValidation,
});

export const deletePostValidation = z.object({
  params: z.object({
    postId: postIdValidation,
  }),
});

export const addCommentToPostValidation = z.object({
  params: z.object({
    postId: postIdValidation,
  }),
  body: z.object({
    content: z.string().min(3),
  }),
});

export const getPostCommentsValidation = z.object({
  params: z.object({
    postId: postIdValidation,
  }),
  query: paginationValidation,
});

export const likePostValidation = z.object({
  params: z.object({
    postId: postIdValidation,
  }),
});

export const updatePostValidation = z.object({
  body: z
    .object({
      content: z.string().min(10),
    })
    .strict(),
  params: z.object({
    postId: postIdValidation,
  }),
});

export const changePostImagesValidation = z
  .object({
    files: z.array(fileValidation).min(1).max(4),
    body: z
      .object({
        replaceWithIds: z.array(z.string()),
      })
      .strict(),
    params: z.object({
      postId: postIdValidation,
    }),
  })
  .refine(({ files, body }) => body.replaceWithIds.length == files.length, {
    path: ['body'],
    message: 'files and replaceWith should be of equal size.',
  });
