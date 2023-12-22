import z from 'zod';

interface ValidationError {
  field: z.ZodIssue['path'][number] | undefined;
  message: string;
}

export default ValidationError;
