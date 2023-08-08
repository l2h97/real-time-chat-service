import { Injectable } from "@nestjs/common";
import { profileQuery } from "src/core/users/transformProfile/transformProfile.service";
import { BadRequestException } from "src/exceptions/badRequest.exception";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { RedisService } from "src/services/redisService/redis.service";
import { REDIS_KEY } from "src/services/redisService/redisKey";
import { IAuthUser } from "src/services/tokenService/authUser.interface";

@Injectable()
export class LogoutService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async execute(authUser: IAuthUser) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!user) {
      throw new BadRequestException("User is not found");
    }

    const redisKey = this.redisService.genRedisKey(
      REDIS_KEY.ACCESS_TOKEN,
      user.id,
    );
    const tokenFromRedis = await this.redisService.get(redisKey);
    if (tokenFromRedis) {
      await this.redisService.delete(redisKey);
    }

    await this.prismaService.user.update({
      data: {
        refreshToken: {
          set: null,
        },
      },
      where: {
        id: user.id,
      },
      ...profileQuery,
    });
  }
}
