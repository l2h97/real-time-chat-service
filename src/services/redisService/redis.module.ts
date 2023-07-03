import { Module } from "@nestjs/common";
import { createClient } from "@redis/client";
import { ConfigurationModule } from "../configurationService/configuration.module";
import { ConfigurationService } from "../configurationService/configuration.service";
import { RedisService } from "./redis.service";

@Module({
  imports: [ConfigurationModule],
  controllers: [],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: async (configurationService: ConfigurationService) => {
        const redisHost = configurationService.redisHost;
        const redisPort = configurationService.redisPort;
        const url = `redis://${redisHost}:${redisPort}`;

        const redisClient = createClient({
          url,
        });
        await redisClient.connect();
        return redisClient;
      },
      inject: [ConfigurationService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
