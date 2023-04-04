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
import { Request } from "express";
import { AuthInterceptor } from "src/interceptions/auth.interceptor";
import { SignOutService } from "./signOut/signOut.service";
import { RegisterService } from "./register/register.service";
import { RegisterPayloadDto } from "./register/registerPayloadDto";
import { SignInService } from "./signIn/signIn.service";
import { SignInPayloadDto } from "./signIn/signInPayloadDto";
import { JwtAuthGuard } from "./strategy/jwtStrategy/jwtAuth.guard";
import { RefreshTokenAuthGuard } from "./strategy/refreshTokenStrategy/refreshTokenAuth.guard";
import { RefreshTokenService } from "./refreshToken/refreshToken.service";

@UseInterceptors(AuthInterceptor)
@Controller({
  path: "auth",
  version: ["v1"],
})
export class AuthController {
  constructor(
    private registerService: RegisterService,
    private signInService: SignInService,
    private signOutService: SignOutService,
    private refreshTokenService: RefreshTokenService
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.OK)
  async register(@Body() payload: RegisterPayloadDto) {
    return this.registerService.execute(payload);
  }

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() payload: SignInPayloadDto) {
    return this.signInService.execute(payload);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() request: Request) {
    return this.refreshTokenService.execute(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: Request) {
    return this.signOutService.execute(request.user);
  }
}
