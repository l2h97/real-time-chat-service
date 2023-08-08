import { Injectable } from "@nestjs/common";
import {
  TransformMyProfileResponse,
  profileQuery,
} from "src/core/users/transformProfile/transformProfile.service";
import { BadRequestException } from "src/exceptions/badRequest.exception";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transformMyProfileResponse: TransformMyProfileResponse,
  ) {}

  async execute(authUser: IAuthUser) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: authUser.id,
      },
      ...profileQuery,
    });

    if (!user) {
      throw new BadRequestException("User is not found");
    }

    return this.transformMyProfileResponse.transform(user);
  }
}
