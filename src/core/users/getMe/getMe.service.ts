import { Injectable } from "@nestjs/common";
import {
  TransformMyProfileResponse,
  myProfileQuery,
} from "src/core/auth/register/register.service";
import { NotFoundException } from "src/exceptions/notFound.exception";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";

@Injectable()
export class GetMeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transformMyProfileResponse: TransformMyProfileResponse,
  ) {}

  async execute(authUser: IAuthUser) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: authUser.id,
      },
      ...myProfileQuery,
    });

    if (!user) {
      throw new NotFoundException("User is not found");
    }

    return this.transformMyProfileResponse.transform(user);
  }
}
