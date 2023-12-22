import z from 'zod';
import { ValidationError, ValidateRequestResult } from '../types/validation.types';
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
): ValidateRequestResult<z.ZodObject<T>> => {
  const parsedRequest = validator.safeParse(req);

  if (parsedRequest.success) {
    return {
      success: true,
      data: parsedRequest.data,
    };
  }
  return {
    success: false,
    errors: parsedRequest.error.errors?.map((error) => formatZodIssue(error)),
  };
};
