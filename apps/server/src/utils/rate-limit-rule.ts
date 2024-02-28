export class RateLimitRule {
  constructor(
    public readonly time: number,
    public readonly limit: number,
    public readonly message: string = 'Too many requests.'
  ) {
    this.time = time;
    this.limit = limit;
    this.message = message;
  }
}
