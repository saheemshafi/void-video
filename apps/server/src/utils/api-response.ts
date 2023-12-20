class ApiResponse<T> {
  constructor(
    public status: number,
    public message: string = 'success',
    public data: T | null = null,
    public success?: boolean
  ) {
    this.status = status;
    this.success = status < 400;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
