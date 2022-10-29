import { Injectable } from '@nestjs/common';
import { UserQueryDto } from 'src/dtos/queryDtos/userQueryDto';
import { UserResponseDto } from './userResponseDto';

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
      profileImage: user.profileImage ? {
        id: user.profileImage.id.toString(),
        code: user.profileImage.code || undefined,
        url: user.profileImage.url,
        createdAt: user.profileImage.createdAt.toISOString(),
        updatedAt: user.profileImage.updatedAt.toISOString(),
      } : undefined,
      coverImage: user.coverImage ? {
        id: user.coverImage.id.toString(),
        code: user.coverImage.code || undefined,
        url: user.coverImage.url,
        createdAt: user.coverImage.createdAt.toISOString(),
        updatedAt: user.coverImage.updatedAt.toISOString(),
      } : undefined,
    };
  }
}
