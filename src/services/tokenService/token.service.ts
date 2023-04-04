import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

export type AuthUserDto = {
  id?: string;
  email?: string;
  userName?: string;
};

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async genToken(payload: AuthUserDto) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get("jwtTokenKey"),
      expiresIn: this.configService.get("jwtTokenExpiredIn"),
    });
  }

  async genRefreshToken(payload: AuthUserDto) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get("jwtRefreshTokenKey"),
      expiresIn: this.configService.get("jwtRefreshTokenExpiredIn"),
    });
  }
}
