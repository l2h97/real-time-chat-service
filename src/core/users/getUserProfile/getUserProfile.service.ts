import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";
import { GetMeService } from "../getMe/getMe.service";

@Injectable()
export class GetUserProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly getMeService: GetMeService,
  ) {}

  async execute(authUser: IAuthUser, id: number) {
    if (authUser.id === id) {
      return await this.getMeService.execute(authUser);
    }
  }
}
