import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Configs } from "src/configs/configs";
import { UnauthorizedException } from "src/exceptions/unauthorized.exception";
import { AuthUserDto } from "src/services/tokenService/token.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt_refresh_token",
) {
  constructor(private configService: ConfigService<Configs, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromHeader("refresh_token"),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwtRefreshTokenKey"),
    });
  }

  async validate(payload: AuthUserDto) {
    return payload;
  }
}
