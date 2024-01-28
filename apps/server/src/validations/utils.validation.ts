import { isValidObjectId } from 'mongoose';
import z from 'zod';
import { Models } from '../types/validation.types';

export const paginationSchema = z.object({
  limit: z.coerce.number().gte(5).default(10),
  page: z.coerce.number().gte(0).default(1),
});

export const objectIdSchema = (modelName: Models) =>
  z.string().refine((modelId) => isValidObjectId(modelId), {
    path: [modelName],
    message: `${modelName} id is not valid.`,
  });

export const sortOptions = z
  .enum(['views.asc', 'views.desc', 'title.asc', 'title.desc'])
  .default('title.asc');
