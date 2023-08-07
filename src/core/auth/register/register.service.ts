import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { RegisterPayload } from "./register.payload";
import { Prisma } from "@prisma/client";
import { PasswordService } from "src/services/passwordService/password.service";
import {
  TransformMyProfileResponse,
  profileQuery,
} from "src/core/users/transformProfile/transformProfile.service";

@Injectable()
export class RegisterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transformMyProfileResponse: TransformMyProfileResponse,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(payload: RegisterPayload) {
    const { email, password } = payload;

    const user = await this.findUser(email);

    if (user) {
      return this.transformMyProfileResponse.transform(user);
    }

    const newUser = await this.createUser(email, password);
    return this.transformMyProfileResponse.transform(newUser);
  }

  async findUser(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      ...profileQuery,
    });

    return user;
  }

  async createUser(email: string, password: string) {
    const { salt, passwordHashed } = await this.passwordService.hashPassword(
      password,
    );

    const userCreateInput: Prisma.UserCreateInput = {
      email,
      salt,
      passwordHashed,
    };

    const user = await this.prismaService.user.create({
      data: userCreateInput,
      ...profileQuery,
    });

    return user;
  }
}
