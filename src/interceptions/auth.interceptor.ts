import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { UserResponseDto } from "src/interactors/auth/common/userResponseDto";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<UserResponseDto> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return;
        }

        const res = context.switchToHttp().getResponse();
        if (!data.token && !data.refreshToken) {
          return data;
        }

        const { token, refreshToken, user } = data;
        res.setHeader("Authorization", token);
        res.setHeader("refresh_token", refreshToken);

        return user;
      }),
    );
  }
}
