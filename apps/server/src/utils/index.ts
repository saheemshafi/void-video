import z from 'zod';
import {
  ValidationError,
  ValidateRequestResult,
} from '../types/validation.types';
import { Request } from 'express';
import ApiError from './api-error';
import { STATUS_CODES } from '../constants';

export const formatZodIssue = (error: z.ZodIssue): ValidationError => {
  return {
    field: error.path[1] || error.path[0],
    message: error.message,
  };
};

export const validateRequest = <T extends z.ZodRawShape>(
  req: Request,
  validator: z.ZodObject<T>
): ValidateRequestResult<z.ZodObject<T>> => {
  const parsedRequest = validator.safeParse(req);

  if (parsedRequest.success) {
    return parsedRequest.data;
  }

  throw new ApiError(
    STATUS_CODES.BAD_REQUEST,
    'Failed to validate request.',
    parsedRequest.error.errors?.map((error) => formatZodIssue(error))
  );
};
