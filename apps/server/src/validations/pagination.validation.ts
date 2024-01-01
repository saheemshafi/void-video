import z from 'zod';

const paginationValidation = z.object({
  limit: z.coerce.number().gte(10).default(10),
  page: z.coerce.number().gte(0).default(1),
});

export default paginationValidation;
