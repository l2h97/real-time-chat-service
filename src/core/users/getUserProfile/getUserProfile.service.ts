import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";
import { GetMeService } from "../getMe/getMe.service";
import {
  TransformProfileResponse,
  profileQuery,
} from "../transformProfile/transformProfile.service";
import { NotFoundException } from "src/exceptions/notFound.exception";

@Injectable()
export class GetUserProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly getMeService: GetMeService,
    private readonly transformProfileResponse: TransformProfileResponse,
  ) {}

  async execute(authUser: IAuthUser, id: number) {
    if (authUser?.id === id) {
      return await this.getMeService.execute(authUser);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      ...profileQuery,
    });

    if (!user) {
      throw new NotFoundException("User is not found");
    }

    return this.transformProfileResponse.transform(user);
  }
}
