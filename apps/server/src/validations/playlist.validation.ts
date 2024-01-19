import z from 'zod';
import fileValidation from './multer.validation';
import { objectIdSchema, paginationSchema } from './utils.validation';
import { videoIdSchema } from './video.validation';

export const playlistSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(15),
  private: z.coerce.boolean(),
});

const playlistIdSchema = objectIdSchema('Playlist');

export const createPlaylistSchema = z.object({
  body: playlistSchema
    .omit({ title: true })
    .partial()
    .merge(playlistSchema.pick({ title: true }))
    .strict(),
  file: fileValidation,
});

export const updatePlaylistSchema = z.object({
  body: playlistSchema
    .partial()
    .strict()
    .refine((body) => Object.keys(body).length == 0, {
      path: ['body'],
      message: 'Provide fields to update.',
    }),
  params: z
    .object({
      playlistId: objectIdSchema('Playlist'),
    })
    .strict(),
});

export const deletePlaylistSchema = z.object({
  params: z
    .object({
      playlistId: playlistIdSchema,
    })
    .strict(),
});

export const changePlaylistThumbnailSchema = z.object({
  params: z
    .object({
      playlistId: playlistIdSchema,
    })
    .strict(),
  file: fileValidation,
});

export const reqWithVideoAndPlaylistIdSchema = z.object({
  params: z
    .object({
      playlistId: playlistIdSchema,
      videoId: videoIdSchema,
    })
    .strict(),
});

export const getPlaylistSchema = z.object({
  params: z.object({
    playlistId: playlistIdSchema,
  }),
});

export const getPlaylistsSchema = z.object({
  query: paginationSchema,
});
