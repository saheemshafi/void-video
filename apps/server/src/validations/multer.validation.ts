import z from 'zod';

const fileValidation = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
});

export default fileValidation;
