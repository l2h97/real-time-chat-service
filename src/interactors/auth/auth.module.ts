import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { TokenService } from "src/services/tokenService/token.service";
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

@Module({
  imports: [RedisModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    ConfigService,
    TokenService,
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
