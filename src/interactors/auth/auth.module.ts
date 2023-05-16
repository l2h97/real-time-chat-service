import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserCreateTokenService } from "./common/userCreateToken.service";
import { UserTransformService } from "./common/userTransform.service";
import { SignOutService } from "./signOut/signOut.service";
import { RegisterService } from "./register/register.service";
import { SignInService } from "./signIn/signIn.service";
import { JwtStrategy } from "./strategy/jwtStrategy/jwt.strategy";
import { RefreshTokenStrategy } from "./strategy/refreshTokenStrategy/refreshToken.strategy";
import { RefreshTokenService } from "./refreshToken/refreshToken.service";
import { RedisModule } from "src/services/redisService/redis.module";
import { PrismaModule } from "src/services/prismaService/prisma.module";
import { TokenModule } from "src/services/tokenService/token.module";

@Module({
  imports: [RedisModule, PrismaModule, TokenModule],
  controllers: [AuthController],
  providers: [
    ConfigService,
    JwtService,
    RegisterService,
    UserTransformService,
    UserCreateTokenService,
    SignInService,
    JwtStrategy,
    SignOutService,
    RefreshTokenStrategy,
    RefreshTokenService,
  ],
})
export class AuthModule {}
