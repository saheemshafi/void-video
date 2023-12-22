import z from 'zod';
import fileValidation from './multer.validation';

export const createAccountValidation = z.object({
  body: z.object({
    displayName: z.string().min(3),
    username: z.string().min(6).toLowerCase(),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  files: z.object({
    avatar: z.array(fileValidation).min(1).max(1),
    banner: z.array(fileValidation).min(1).max(1),
  }),
});
