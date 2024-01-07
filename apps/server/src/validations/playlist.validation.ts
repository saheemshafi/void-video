import z from 'zod';
import fileValidation from './multer.validation';

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
