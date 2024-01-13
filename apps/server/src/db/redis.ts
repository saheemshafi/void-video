import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URI,
});

async function connectRedis() {
  try {
    await redis.connect();
    console.log(`REDIS: Redis connected at ${process.env.REDIS_URI}.`);
  } catch (error) {
    console.log('REDIS: Redis connection failed. ', error);
    process.exit(1);
  }
}

export { redis as default, connectRedis };
