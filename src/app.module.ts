import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./configs/configuration.module";
import { PrismaModule } from "./services/prismaService/prisma.module";
import { PasswordModule } from "./services/passwordService/password.module";
import { RedisModule } from "./services/redisService/redis.module";

@Module({
  imports: [ConfigurationModule, PrismaModule, PasswordModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
