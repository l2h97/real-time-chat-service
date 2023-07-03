import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigurationService } from "../configurationService/configuration.service";
import { IAuthUser } from "./authUser.interface";
import { RedisService } from "../redisService/redis.service";
import { REDIS_KEY } from "../redisService/redisKey";
import { PrismaService } from "../prismaService/prisma.service";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configurationService: ConfigurationService,
    private redisService: RedisService,
    private prismaService: PrismaService
  ) {}

  async genAccessToken(payload: IAuthUser): Promise<string> {
    const tokenKey = this.configurationService.jwtTokenKey;
    const expiredTime = this.configurationService.jwtTokenExpiredIn;
    const token = await this.genToken(payload, tokenKey, expiredTime);

    const redisKey = this.redisService.genRedisKey(
      REDIS_KEY.ACCESS_TOKEN,
      payload.id
    );
    const tokenFromRedis = await this.redisService.get(redisKey);
    if (tokenFromRedis) {
      await this.redisService.delete(redisKey);
    }
    const tokenExpirationTime = this.configurationService.jwtTokenExpiredIn;
    await this.redisService.set(redisKey, token, tokenExpirationTime);

    return token;
  }

  async genRefreshToken(payload: IAuthUser): Promise<string> {
    const tokenKey = this.configurationService.jwtRefreshTokenKey;
    const expiredTime = this.configurationService.jwtRefreshTokenExpiredIn;
    const token = await this.genToken(payload, tokenKey, expiredTime);

    await this.prismaService.pac_users.update({
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
    expiredTime: number
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: tokenKey,
      expiresIn: expiredTime,
    });
  }
}
