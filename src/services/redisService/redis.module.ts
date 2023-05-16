import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { Configs } from "src/configs/configs";
import { RedisService } from "./redis.service";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: async (configService: ConfigService<Configs, true>) => {
        const url = `redis://${configService.get(
          "redisHost",
        )}:${configService.get("redisPort")}`;
        const redisClient = createClient({
          url,
        });
        await redisClient.connect();
        return redisClient;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
