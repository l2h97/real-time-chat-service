import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Configs } from "src/configs/configs";
import { ForbiddenException } from "src/exceptions/forbidden.exception";
import { RedisService } from "src/services/redisService/redis.service";
import { AuthUserDto } from "src/services/tokenService/token.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService<Configs, true>,
    private redisService: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwtTokenKey"),
    });
  }

  async validate(payload: AuthUserDto): Promise<AuthUserDto | undefined> {
    if (!payload || !payload.id) {
      return;
    }

    const getUserFromBlackList = await this.redisService.get(payload.id);
    if (!getUserFromBlackList) {
      throw new ForbiddenException("Invald Token");
    }
    return payload;
  }
}
