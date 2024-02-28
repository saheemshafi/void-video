import { STATUS_CODES } from '../constants';
import redis from '../db/redis';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import { RateLimitRule } from '../utils/rate-limit-rule';

export const rateLimiter = (rule: RateLimitRule) => {
  const { time, limit, message } = rule;

  return asyncHandler(async (req, res, next) => {
    const redisKey = `${req.url}:${req.ip}`;

    const requests = await redis.incr(redisKey);
    if (requests === 1) {
      await redis.expire(redisKey, time);
    }
    if (requests > limit) {
      res
        .status(STATUS_CODES.TOO_MANY_REQUESTS)
        .json(new ApiResponse(STATUS_CODES.TOO_MANY_REQUESTS, message));
    }
    next();
  });
};
