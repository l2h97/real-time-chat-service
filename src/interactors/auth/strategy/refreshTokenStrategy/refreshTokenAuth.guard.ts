import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { UnauthorizedException } from "src/exceptions/unauthorized.exception";

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard("jwt_refresh_token") {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("haha");
    const req = context.switchToHttp().getRequest();
    if (!req || !req.user) {
      throw new UnauthorizedException("Invald token");
    }
    return true;
  }
}
