import { STATUS_CODES, STATUS_CODES_TYPE } from '../constants';

class ApiResponse<T> {
  constructor(
    public status: STATUS_CODES_TYPE[keyof STATUS_CODES_TYPE],
    public message: string = 'success',
    public data: T | null = null,
    public success?: boolean
  ) {
    this.status = status;
    this.success = status < STATUS_CODES.BAD_REQUEST;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
