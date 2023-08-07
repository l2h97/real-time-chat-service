import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { GetUserProfileService } from "./getUserProfile/getUserProfile.service";
import { JwtTokenGuard } from "../auth/guards/jwtToken.guard";
import { GetMeService } from "./getMe/getMe.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly getUserProfileService: GetUserProfileService,
    private readonly getMeService: GetMeService,
  ) {}

  @UseGuards(JwtTokenGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    return await this.getMeService.execute(req.user);
  }
}
