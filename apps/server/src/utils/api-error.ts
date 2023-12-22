import { STATUS_CODES_TYPE } from '../constants';
import ValidationError from '../types/validation-error';

class ApiError extends Error {
  constructor(
    public status: STATUS_CODES_TYPE[keyof STATUS_CODES_TYPE],
    public message: string,
    public errors: ValidationError[] | null = null,
    public success = false,
    stack?: string
  ) {
    super(message);
    this.status = status;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
