import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RegisterService } from "./register/register.service";
import { RegisterPayload } from "./register/register.payload";
import { TokenInterceptor } from "src/interceptors/token.interceptor";
import { LoginPayload } from "./login/login.payload";
import { LoginService } from "./login/login.service";
import { LogoutService } from "./logout/logout.service";
import { Request } from "express";
import { RefreshTokenService } from "./refreshToken/refreshToken.service";
import { RefreshTokenInterceptor } from "src/interceptors/refreshToken.interceptor";
import { JwtRefreshTokenGuard } from "./guards/jwtRefreshToken.guard";
import { JwtTokenGuard } from "./guards/jwtToken.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.OK)
  async register(@Body() payload: RegisterPayload) {
    return await this.registerService.execute(payload);
  }

  @UseInterceptors(TokenInterceptor)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginPayload) {
    return await this.loginService.execute(payload);
  }

  @UseGuards(JwtTokenGuard)
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    return await this.logoutService.execute(req.user);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @Post("token/refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request) {
    return await this.refreshTokenService.execute(req.user);
  }
}
