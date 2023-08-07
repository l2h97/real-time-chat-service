import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./configs/configuration.module";
import { PrismaModule } from "./services/prismaService/prisma.module";
import { PasswordModule } from "./services/passwordService/password.module";
import { RedisModule } from "./services/redisService/redis.module";
import { AppController } from "./app.controller";
import { AuthModule } from "./core/auth/auth.module";
import { UserModule } from "./core/users/user.module";
import { TokenModule } from "./services/tokenService/token.module";

@Module({
  imports: [
    ConfigurationModule,
    PrismaModule,
    PasswordModule,
    RedisModule,
    AuthModule,
    UserModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
