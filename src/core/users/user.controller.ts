import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { GetUserProfileService } from "./getUserProfile/getUserProfile.service";
import { JwtTokenGuard } from "../auth/guards/jwtToken.guard";
import { GetMeService } from "./getMe/getMe.service";
import { AllowAnonymous } from "../auth/guards/allowAnonymous.decorator";
import { UpdateProfilePayload } from "./updateProfile/updateProfile.payload";
import { UpdateProfileService } from "./updateProfile/updateProfile.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(
    private readonly getUserProfileService: GetUserProfileService,
    private readonly getMeService: GetMeService,
    private readonly updateProfileService: UpdateProfileService,
  ) {}

  @UseGuards(JwtTokenGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    return await this.getMeService.execute(req.user);
  }

  @UseGuards(JwtTokenGuard)
  @AllowAnonymous()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @Req() req: Request,
    @Param("id", new ParseIntPipe()) id: number,
  ) {
    return await this.getUserProfileService.execute(req.user, id);
  }

  @UseGuards(JwtTokenGuard)
  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: Request,
    @Body() payload: UpdateProfilePayload,
  ) {
    return await this.updateProfileService.execute(req.user, payload);
  }
}
