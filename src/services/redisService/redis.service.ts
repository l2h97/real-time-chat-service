import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";
import { REDIS_KEY } from "./redisKey";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS_CLIENT") private redisClient: RedisClientType) {}

  genRedisKey(key: REDIS_KEY, value: number | string): string {
    return `${key}-${value}`;
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, expireTime: number) {
    await this.redisClient.set(key, value, {
      EX: expireTime,
    });
  }

  async delete(key: string) {
    await this.redisClient.del(key);
  }
}
