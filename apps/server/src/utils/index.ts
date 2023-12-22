import z from 'zod';
import ValidationError from '../types/validation-error';
import { Request } from 'express';

export const formatZodIssue = (error: z.ZodIssue): ValidationError => {
  return {
    field: error.path[1],
    message: error.message,
  };
};

export const validateRequest = <T extends z.ZodRawShape>(
  req: Request,
  validator: z.ZodObject<T>
) => {
  const parsedRequest = validator.safeParse(req);

  if (!parsedRequest.success) {
    return {
      success: parsedRequest.success,
      errors: parsedRequest.error.errors?.map((error) => formatZodIssue(error)),
    };
  }
  return { success: false, data: parsedRequest.data };
};
