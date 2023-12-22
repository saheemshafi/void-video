import z from 'zod';

export interface ValidationError {
  field: z.ZodIssue['path'][number] | undefined;
  message: string;
}

export type ValidateRequestResult<T extends z.ZodSchema> =
  | { success: true; data: z.infer<T> }
  | { success: false; errors: ValidationError[] };
