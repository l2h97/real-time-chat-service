import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_CLIENT") private readonly redisClient: RedisClientType
  ) {}

  async get(value: string) {
    return this.redisClient.get(value);
  }

  async set(key: string, value: string, expireTime: number) {
    await this.redisClient.set(key, value, {
      EX: expireTime,
      NX: true,
    });
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }
}
