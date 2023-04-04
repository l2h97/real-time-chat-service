import { Injectable } from "@nestjs/common";
import { NotFoundException } from "src/exceptions/notFound.exception";
import { passwordComparer } from "src/pkgs/passwordComparer";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { UserCreateTokenService } from "../common/userCreateToken.service";
import { UserAuthResDto } from "../common/userAuthResDto";
import { UserResponseDto } from "../common/userResponseDto";
import { UserTransformService } from "../common/userTransform.service";
import { SignInPayloadDto } from "./signInPayloadDto";
import { ConflictException } from "src/exceptions/conflict.exception";

@Injectable()
export class SignInService {
  constructor(
    private prismaService: PrismaService,
    private userCreateTokenService: UserCreateTokenService,
    private userTransformService: UserTransformService
  ) {}

  async execute(
    payload: SignInPayloadDto
  ): Promise<UserAuthResDto | UserResponseDto> {
    const { email, password } = payload;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        profileImage: true,
        coverImage: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User is not found");
    }

    const isMatchPassword = await passwordComparer(
      email,
      password,
      user.hashPassword
    );
    if (!isMatchPassword) {
      return this.userTransformService.execute(user);
    }

    const { token, refreshToken } = await this.userCreateTokenService.execute(
      user.id,
      user.email,
      user.userName
    );

    try {
      await this.prismaService.user.update({
        data: {
          refreshToken,
        },
        where: {
          id: user.id,
        },
      });
    } catch (error) {
      throw new ConflictException("Can't update refresh token for user");
    }

    return {
      token,
      refreshToken,
      user: this.userTransformService.execute(user),
    };
  }
}
