import { STATUS_CODES_TYPE } from '../constants';

class ApiError extends Error {
  constructor(
    public status: STATUS_CODES_TYPE[keyof STATUS_CODES_TYPE],
    public message: string,
    public data = null,
    public success = false,
    stack?: string
  ) {
    super(message);
    this.status = status;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
