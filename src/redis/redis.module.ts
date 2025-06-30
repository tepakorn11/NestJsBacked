// src/redis/redis.module.ts
import { Module } from '@nestjs/common';
import Redis from 'ioredis';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const host = process.env.REDIS_HOST || '127.0.0.1';
    return new Redis({ host, port: 6379 });
  },
};


@Module({
  providers: [redisProvider],
  exports: [redisProvider], 
})
export class RedisModule {}
