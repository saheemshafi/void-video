import { isValidObjectId } from 'mongoose';
import z from 'zod';
import { Models } from '../types/validation.types';

export const paginationSchema = z.object({
  limit: z.coerce.number().gte(10).default(10),
  page: z.coerce.number().gte(0).default(1),
});

export const objectIdSchema = (modelName: Models) =>
  z.string().refine((modelId) => isValidObjectId(modelId), {
    path: [modelName],
    message: `${modelName} id is not valid.`,
  });
