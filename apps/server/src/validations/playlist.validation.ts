import z from 'zod';
import fileValidation from './multer.validation';
import { objectIdValidation, paginationValidation } from './utils.validation';

export const createPlaylistValidation = z.object({
  body: z
    .object({
      title: z.string().min(5),
      description: z.string().min(15).optional(),
      private: z.coerce.boolean().optional(),
    })
    .strict(),
  file: fileValidation,
});

export const updatePlaylistValidation = z.object({
  body: z
    .object({
      title: z.string().min(5).optional(),
      description: z.string().min(15).optional(),
      private: z.coerce.boolean().optional(),
    })
    .strict()
    .refine((body) => Object.keys(body).length == 0, {
      path: ['body'],
      message: 'Provide fields to update.',
    }),
  params: z
    .object({
      playlistId: objectIdValidation('Playlist'),
    })
    .strict(),
});

export const deletePlaylistValidation = z.object({
  params: z
    .object({
      playlistId: objectIdValidation('Playlist'),
    })
    .strict(),
});

export const changePlaylistThumbnailValidation = z.object({
  params: z
    .object({
      playlistId: objectIdValidation('Playlist'),
    })
    .strict(),
  file: fileValidation,
});

export const addVideoToPlaylistValidation = z.object({
  params: z
    .object({
      playlistId: objectIdValidation('Playlist'),
      videoId: objectIdValidation('Video'),
    })
    .strict(),
});

export const removeVideoFromPlaylistValidation = z.object({
  params: z
    .object({
      playlistId: objectIdValidation('Playlist'),
      videoId: objectIdValidation('Video'),
    })
    .strict(),
});

export const getPlaylistValidation = z.object({
  params: z.object({
    playlistId: objectIdValidation('Playlist'),
  }),
});

export const getPlaylistsValidation = z.object({
  query: paginationValidation,
});
