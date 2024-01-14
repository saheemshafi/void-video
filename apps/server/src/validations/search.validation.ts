import z from 'zod';

export const suggestSearchTermsValidation = z.object({
  query: z.object({
    searchTerm: z.string(),
  }),
});
