import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";
import { UpdateProfilePayload } from "./updateProfile.payload";
import { profileQuery } from "../transformProfile/transformProfile.service";
import { BadRequestException } from "src/exceptions/badRequest.exception";
import { Prisma } from "@prisma/client";

@Injectable()
export class UpdateProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(authUser: IAuthUser, payload: UpdateProfilePayload) {
    const { email, firstName, lastName, photo, cover } = payload;

    const user = await this.prismaService.user.findUnique({
      where: {
        id: authUser.id,
      },
      ...profileQuery,
    });

    if (!user) {
      throw new BadRequestException("User is not found");
    }

    const isEmailExists =
      email && email !== user.email ? await this.isEmailExists(email) : false;

    if (isEmailExists) {
      throw new BadRequestException("Email was registered");
    }

    const userUpdateInput: Prisma.UserUpdateInput = {
      email: email && email !== user.email ? email : undefined,
      firstName,
      lastName,
      profileImage: photo
        ? {
            create: {
              code: photo.code,
              url: photo.url,
              createdBy: {
                connect: {
                  id: user.id,
                },
              },
            },
          }
        : undefined,
      coverImage: cover
        ? {
            create: {
              code: cover.code,
              url: cover.url,
              createdBy: {
                connect: {
                  id: user.id,
                },
              },
            },
          }
        : undefined,
    };

    return userUpdateInput;
  }

  async isEmailExists(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return !!user;
  }
}
