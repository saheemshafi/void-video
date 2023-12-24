import z from 'zod';

export interface ValidationError {
  field: z.ZodIssue['path'][number] | undefined;
  message: string;
}

export type ValidateRequestResult<T extends z.ZodSchema> = z.infer<T>;
