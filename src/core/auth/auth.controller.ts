import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
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

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.OK)
  async register(@Body() payload: RegisterPayload) {
    return await this.registerService.execute(payload);
  }

  @Post("login")
  @UseInterceptors(TokenInterceptor)
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginPayload) {
    return await this.loginService.execute(payload);
  }

  @Post("logout")
  @UseInterceptors(TokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    return await this.logoutService.execute(req.user);
  }
}
