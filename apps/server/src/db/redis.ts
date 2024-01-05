import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URI,
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log(`REDIS: Redis connected at ${process.env.REDIS_URI}.`);
  } catch (error) {
    console.log('REDIS: Redis connection failed. ', error);
    process.exit(1);
  }
}

export { redisClient as default, connectRedis };
