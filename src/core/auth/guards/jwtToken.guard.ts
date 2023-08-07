import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TokenService } from "src/services/tokenService/token.service";
import { ALLOW_ANONYMOUS } from "./allowAnonymous.decorator";
import { Request } from "express";
import { ForbiddenException } from "src/exceptions/forbidden.exception";

@Injectable()
export class JwtTokenGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowAnonymous = this.reflector.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);

    if (!allowAnonymous && !accessToken) {
      throw new ForbiddenException("You can't access this resource");
    }

    if (accessToken) {
      const payload = await this.tokenService.verifyAccessToken(accessToken);
      request.user = {
        id: payload.id,
        email: payload.email,
      };
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
