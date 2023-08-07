import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IAuthUser } from "./authUser.interface";
import { RedisService } from "../redisService/redis.service";
import { REDIS_KEY } from "../redisService/redisKey";
import { PrismaService } from "../prismaService/prisma.service";
import { ConfigurationService } from "src/configs/configuration.service";
import { UnauthorizedException } from "src/exceptions/unauthorized.exception";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class TokenService {
  private accessTokenKey: string;
  private accessTokenExpiredTime: number;
  private refreshTokenKey: string;
  private refreshTokenExpiredTime: number;
  constructor(
    private jwtService: JwtService,
    private configurationService: ConfigurationService,
    private redisService: RedisService,
    private prismaService: PrismaService,
  ) {
    this.accessTokenKey = this.configurationService.jwtTokenKey;
    this.accessTokenExpiredTime = this.configurationService.jwtTokenExpiredIn;
    this.refreshTokenKey = this.configurationService.jwtRefreshTokenKey;
    this.refreshTokenExpiredTime =
      this.configurationService.jwtRefreshTokenExpiredIn;
  }

  async genAccessToken(payload: IAuthUser): Promise<string> {
    const redisKey = this.redisService.genRedisKey(
      REDIS_KEY.ACCESS_TOKEN,
      payload.id,
    );
    const tokenFromRedis = await this.redisService.get(redisKey);
    if (tokenFromRedis) {
      await this.redisService.delete(redisKey);
    }

    const token = await this.genToken(
      payload,
      this.accessTokenKey,
      this.accessTokenExpiredTime,
    );
    await this.redisService.set(redisKey, token, this.accessTokenExpiredTime);

    return token;
  }

  async genRefreshToken(payload: IAuthUser): Promise<string> {
    const token = await this.genToken(
      payload,
      this.refreshTokenKey,
      this.refreshTokenExpiredTime,
    );

    await this.prismaService.user.update({
      data: {
        refreshToken: token,
      },
      where: {
        id: payload.id,
      },
    });
    return token;
  }

  async genToken(
    payload: IAuthUser,
    tokenKey: string,
    expiredTime: number,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: tokenKey,
      expiresIn: expiredTime,
    });
  }

  async verifyAccessToken(token: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          publicKey: this.accessTokenKey,
        },
      );

      return decodedToken;
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token is Expired");
      }

      throw new UnauthorizedException("Token is invalid");
    }
  }
}
