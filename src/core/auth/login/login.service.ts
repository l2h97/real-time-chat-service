import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import {
  TransformMyProfileResponse,
  myProfileQuery,
} from "../register/register.service";
import { LoginPayload } from "./login.payload";
import { BadRequestException } from "src/exceptions/badRequest.exception";
import { PasswordService } from "src/services/passwordService/password.service";

@Injectable()
export class LoginService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly transformMyProfileResponse: TransformMyProfileResponse,
  ) {}

  async execute(payload: LoginPayload) {
    const { email, password } = payload;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      ...myProfileQuery,
    });

    if (!user) {
      throw new BadRequestException("Email not register yet!");
    }

    if (!user.passwordHashed) {
      throw new BadRequestException("Not login method for this email");
    }

    const isMatchPassword = await this.passwordService.comparePassword(
      password,
      user.passwordHashed,
    );

    if (!isMatchPassword) {
      throw new BadRequestException("credential denied");
    }

    return this.transformMyProfileResponse.transform(user);
  }
}
