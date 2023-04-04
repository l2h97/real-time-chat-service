import { Injectable } from "@nestjs/common";
import { UserQueryDto } from "src/dtos/queryDtos/userQueryDto";
import { UserResponseDto } from "./userResponseDto";

@Injectable()
export class UserTransformService {
  execute(user: UserQueryDto): UserResponseDto {
    return {
      id: user.id.toString(),
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      profileImage: {
        id: user.profileImage.id.toString(),
        code: user.profileImage.code || "",
        url: user.profileImage.url,
        createdAt: user.profileImage.createdAt.toISOString(),
        updatedAt: user.profileImage.updatedAt.toISOString(),
      },
      coverImage: {
        id: user.coverImage.id.toString(),
        code: user.coverImage.code || "",
        url: user.coverImage.url,
        createdAt: user.coverImage.createdAt.toISOString(),
        updatedAt: user.coverImage.updatedAt.toISOString(),
      },
    };
  }
}
