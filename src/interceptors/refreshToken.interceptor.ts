import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Request } from "express";
import { MyProfileResponse } from "src/core/users/transformProfile/transformProfile.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";
import { TokenService } from "src/services/tokenService/token.service";
import { PrismaService } from "src/services/prismaService/prisma.service";

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<MyProfileResponse>,
  ): Promise<Observable<Promise<MyProfileResponse>>> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(async (data: MyProfileResponse) => {
        const authUser: IAuthUser = {
          id: data.id,
          email: data.email,
        };

        const user = await this.prismaService.user.findUnique({
          where: {
            id: data.id,
          },
        });
        let refreshToken =
          this.extractTokenFromHeader(req) ?? user?.refreshToken ?? "";
        if (!refreshToken) {
          refreshToken = await this.tokenService.genRefreshToken(authUser);
        }

        const accessToken = await this.tokenService.genAccessToken(authUser);
        res.setHeader("Authorization", accessToken);
        res.setHeader("refresh_token", refreshToken);
        return data;
      }),
    );
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
