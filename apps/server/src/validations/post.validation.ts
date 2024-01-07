import z from 'zod';
import fileValidation from './multer.validation';
import { objectIdValidation, paginationValidation } from './utils.validation';

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
    postId: objectIdValidation('Post'),
  }),
});

export const getPostsValidation = z.object({
  query: paginationValidation,
});

export const deletePostValidation = z.object({
  params: z.object({
    postId: objectIdValidation('Post'),
  }),
});

export const addCommentToPostValidation = z.object({
  params: z.object({
    postId: objectIdValidation('Post'),
  }),
  body: z.object({
    content: z.string().min(3),
  }),
});

export const getPostCommentsValidation = z.object({
  params: z.object({
    postId: objectIdValidation('Post'),
  }),
  query: paginationValidation,
});

export const likePostValidation = z.object({
  params: z.object({
    postId: objectIdValidation('Post'),
  }),
});

export const updatePostValidation = z.object({
  body: z
    .object({
      content: z.string().min(10),
    })
    .strict(),
  params: z.object({
    postId: objectIdValidation('Post'),
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
      postId: objectIdValidation('Post'),
    }),
  })
  .refine(({ files, body }) => body.replaceWithIds.length == files.length, {
    path: ['body'],
    message: 'files and replaceWith should be of equal size.',
  });
