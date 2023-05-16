import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { UnauthorizedException } from "src/exceptions/unauthorized.exception";
import { RedisService } from "src/services/redisService/redis.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private redisService: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest<Request>();
    const getUserFromBlackList =
      user && user.id ? await this.redisService.get(user.id) : false;
    if (!user || !user.id || !getUserFromBlackList) {
      throw new UnauthorizedException("Invald token");
    }

    return true;
  }
}
