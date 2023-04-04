import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { configEnvironments } from "./configs/configEnvironments";
import { HttpExceptionFilter } from "./exceptions/httpException.filter";
import { AuthModule } from "./interactors/auth/auth.module";
import { PrismaModule } from "./services/prismaService/prisma.module";
import { RedisModule } from "./services/redisService/redis.module";
import { TokenModule } from "./services/tokenService/token.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configEnvironments],
      isGlobal: true,
    }),
    PrismaModule,
    JwtModule,
    TokenModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
