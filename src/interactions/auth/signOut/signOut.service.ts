import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/exceptions/forbidden.exception';
import { NotFoundException } from 'src/exceptions/notFound.exception';
import { PrismaService } from 'src/services/prismaService/prisma.service';
import { RedisService } from 'src/services/redisService/redis.service';
import { AuthUserDto } from 'src/services/tokenService/token.service';

@Injectable()
export class SignOutService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async execute(authUser: AuthUserDto): Promise<void> {
    if (!authUser || !authUser.id) {
      throw new ForbiddenException('Can\'t not access this resource');
    }

    const user = await this.prismaService.user.update({
      data: {
        refreshToken: null,
      },
      where: {
        id: BigInt(authUser.id),
      },
    });

    if (!user) {
      throw new NotFoundException('User is not exists');
    }

    await this.deleteTokenBlackList(authUser.id);
  }

  async deleteTokenBlackList(userId: string): Promise<void> {
    const getUserFromBlackList = await this.redisService.client.get(userId);
    if (getUserFromBlackList) {
      await this.redisService.client.del(userId);
    }
  }
}
