import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TokenModule } from "src/services/tokenService/token.module";
import {
  RegisterService,
  TransformMediaResponse,
  TransformMyProfileResponse,
} from "./register/register.service";
import { PrismaModule } from "src/services/prismaService/prisma.module";
import { PasswordModule } from "src/services/passwordService/password.module";
import { LoginService } from "./login/login.service";

@Module({
  imports: [TokenModule, PrismaModule, PasswordModule],
  controllers: [AuthController],
  providers: [
    RegisterService,
    TransformMyProfileResponse,
    TransformMediaResponse,
    LoginService,
  ],
  exports: [],
})
export class AuthModule {}
