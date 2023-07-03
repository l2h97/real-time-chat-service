import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./token.service";
import { RedisModule } from "../redisService/redis.module";
import { ConfigurationModule } from "../configurationService/configuration.module";
import { PrismaModule } from "../prismaService/prisma.module";

@Module({
  imports: [RedisModule, ConfigurationModule, PrismaModule],
  controllers: [],
  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
