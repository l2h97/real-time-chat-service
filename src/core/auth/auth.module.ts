import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TokenModule } from "src/services/tokenService/token.module";
import { RegisterService } from "./register/register.service";
import { PrismaModule } from "src/services/prismaService/prisma.module";
import { PasswordModule } from "src/services/passwordService/password.module";
import { LoginService } from "./login/login.service";
import { UserModule } from "../users/user.module";
import { RedisModule } from "src/services/redisService/redis.module";
import { LogoutService } from "./logout/logout.service";
import { RefreshTokenService } from "./refreshToken/refreshToken.service";

@Module({
  imports: [TokenModule, PrismaModule, PasswordModule, UserModule, RedisModule],
  controllers: [AuthController],
  providers: [
    RegisterService,
    LoginService,
    LogoutService,
    RefreshTokenService,
  ],
  exports: [],
})
export class AuthModule {}
