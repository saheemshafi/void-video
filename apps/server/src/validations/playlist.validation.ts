import z from 'zod';
import fileValidation from './multer.validation';
import { isValidObjectId } from 'mongoose';

export const playlistIdValidation = z
  .string()
  .refine((playlistId) => isValidObjectId(playlistId), {
    path: ['playlistId'],
    message: 'Playlist id is not valid.',
  });

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
    .refine((body) => Object.keys(body).length == 0, {
      path: ['body'],
      message: 'Provide fields to update.',
    }),
  params: z.object({
    playlistId: playlistIdValidation,
  }),
});
