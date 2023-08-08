import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { GetUserProfileService } from "./getUserProfile/getUserProfile.service";
import { PrismaModule } from "src/services/prismaService/prisma.module";
import { TokenModule } from "src/services/tokenService/token.module";
import { GetMeService } from "./getMe/getMe.service";
import {
  TransformMediaResponse,
  TransformMyProfileResponse,
  TransformProfileResponse,
} from "./transformProfile/transformProfile.service";
import { UpdateProfileService } from "./updateProfile/updateProfile.service";

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [UserController],
  providers: [
    GetUserProfileService,
    GetMeService,
    TransformMyProfileResponse,
    TransformMediaResponse,
    TransformProfileResponse,
    UpdateProfileService,
  ],
  exports: [TransformMyProfileResponse, TransformMediaResponse],
})
export class UserModule {}
