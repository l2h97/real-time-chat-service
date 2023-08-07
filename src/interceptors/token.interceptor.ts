import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { MyProfileResponse } from "src/core/auth/register/register.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";
import { TokenService } from "src/services/tokenService/token.service";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private tokenService: TokenService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<MyProfileResponse>,
  ): Promise<Observable<Promise<MyProfileResponse>>> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(async (data: MyProfileResponse) => {
        const authUser: IAuthUser = {
          id: data.id,
          email: data.email,
        };

        const accessToken = await this.tokenService.genAccessToken(authUser);
        const refreshToken = await this.tokenService.genRefreshToken(authUser);
        res.setHeader("Authorization", accessToken);
        res.setHeader("refresh_token", refreshToken);
        return data;
      }),
    );
  }
}
