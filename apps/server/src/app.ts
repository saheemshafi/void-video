import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './routes';
import { errorHandler } from './utils/error-handler';
import { rateLimiter } from './middlewares/rate-limiter';
import { RateLimitRule } from './utils/rate-limit-rule';
import { RATE_LIMITS_TIME } from './constants';

const app = express();

app.use(
  express.json({
    limit: '16kb',
  })
);
app.use(
  express.urlencoded({
    limit: '16kb',
    extended: true,
  })
);
app.use(express.static('public'));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/api/v1', apiRouter);
app.use(rateLimiter(new RateLimitRule(RATE_LIMITS_TIME.ONE_SECOND, 30))); // 30 requests per second
app.use(errorHandler);

export { app };
