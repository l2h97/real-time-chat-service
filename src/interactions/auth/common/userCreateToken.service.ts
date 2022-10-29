import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from 'src/configs/configs';
import { ConflictException } from 'src/exceptions/conflict.exception';
import { RedisService } from 'src/services/redisService/redis.service';
import { AuthUserDto, TokenService } from 'src/services/tokenService/token.service';

@Injectable()
export class UserCreateTokenService {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService<Configs, true>,
    private redisService: RedisService,
  ) {}

  async execute(id: bigint, email: string, userName?: string): Promise<{ token: string, refreshToken: string }> {
    const tokenPayload: AuthUserDto = {
      id: id.toString(),
      email,
      userName: userName || id.toString(),
    };
    const token = await this.tokenService.genToken(tokenPayload);
    const refreshToken = await this.tokenService.genRefreshToken(tokenPayload);

    const expiredToken: number = this.configService.get('jwtTokenExpiredIn');
    await this.addTokenToBlackList(id, token, expiredToken);

    return {
      token,
      refreshToken,
    };
  }

  async addTokenToBlackList(userId: bigint, token: string, expiredKey: number): Promise<void> {
    try {
      const getUserFromBlackList = await this.redisService.client.get(userId.toString());
      if (getUserFromBlackList) {
        await this.redisService.client.del(userId.toString());
      }
      await this.redisService.client.set(userId.toString(), token, {
        EX: expiredKey,
        NX: true,
      });
    } catch (error) {
      throw new ConflictException('Can\'t not add this token to blacklist');
    }
  }
}
