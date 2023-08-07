import { Injectable } from "@nestjs/common";
import { NotFoundException } from "src/exceptions/notFound.exception";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";
import {
  TransformMyProfileResponse,
  profileQuery,
} from "../transformProfile/transformProfile.service";

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
      ...profileQuery,
    });

    if (!user) {
      throw new NotFoundException("User is not found");
    }

    return this.transformMyProfileResponse.transform(user);
  }
}
