// lib/redis.ts
import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisInstance() {
  if (!redis) {
    redis = new Redis(
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_REDIS!
        : process.env.CLOUD_REDIS!,
    );

    redis.on('connect', () => {
      console.log('Connected to redis');
    });

    redis.on('error', (err) => console.log((err as Error).message));
  }
  return redis;
}

export { redis };
