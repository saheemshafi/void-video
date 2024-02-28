import { CookieOptions } from 'express';

export const DB_NAME = 'void_video';
export const APP_NAME = 'Void Video';

export const STATUS_CODES = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
} as const;

export type STATUS_CODES_TYPE = typeof STATUS_CODES;

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  signed: true,
};

export const RATE_LIMITS_TIME = {
  ONE_SECOND: 1,
  ONE_MINUTE: 60,
  FIVE_MINUTES: 5 * 60,
  TEN_MINUTES: 10 * 60,
  ONE_HOUR: 60 * 60,
  ONE_DAY: 60 * 60 * 24,
  ONE_WEEK: 60 * 60 * 24 * 7,
  FIFTEEN_DAYS: 60 * 60 * 24 * 15,
} as const satisfies Record<Uppercase<string>, number>;
