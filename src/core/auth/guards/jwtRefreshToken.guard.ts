import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { ForbiddenException } from "src/exceptions/forbidden.exception";
import { TokenService } from "src/services/tokenService/token.service";

@Injectable()
export class JwtRefreshTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = this.extractTokenFromHeader(request);

    if (!refreshToken) {
      throw new ForbiddenException("You can't access this resource");
    }

    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    request.user = {
      id: payload.id,
      email: payload.email,
    };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
