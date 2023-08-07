import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { GetUserProfileService } from "./getUserProfile/getUserProfile.service";
import { PrismaModule } from "src/services/prismaService/prisma.module";
import { TokenModule } from "src/services/tokenService/token.module";
import { GetMeService } from "./getMe/getMe.service";
import {
  TransformMediaResponse,
  TransformMyProfileResponse,
} from "../auth/register/register.service";

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [UserController],
  providers: [
    GetUserProfileService,
    GetMeService,
    TransformMyProfileResponse,
    TransformMediaResponse,
  ],
  exports: [],
})
export class UserModule {}
