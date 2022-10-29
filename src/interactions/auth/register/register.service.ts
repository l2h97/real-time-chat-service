import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Configs } from 'src/configs/configs';
import { UserQueryDto } from 'src/dtos/queryDtos/userQueryDto';
import { ConflictException } from 'src/exceptions/conflict.exception';
import { idGenerator } from 'src/pkgs/idGenerator';
import { passwordHasher } from 'src/pkgs/passwordHasher';
import { PrismaService } from 'src/services/prismaService/prisma.service';
import { UserCreateTokenService } from '../common/userCreateToken.service';
import { UserTransformService } from '../common/userTransform.service';
import { RegisterPayloadDto } from './registerPayloadDto';
import { UserAuthResDto } from '../common/userAuthResDto';
import { UserResponseDto } from '../common/userResponseDto';

@Injectable()
export class RegisterService {
  constructor(
    private prismaService: PrismaService,
    private userCreateTokenService: UserCreateTokenService,
    private configService: ConfigService<Configs, true>,
    private userTransformService: UserTransformService
  ) {}

  async execute(payload: RegisterPayloadDto): Promise<UserAuthResDto | UserResponseDto> {
    const {
      email,
    } = payload;

    const user = await this.findOldUser(email);
    if (user) {
      return this.userTransformService.execute(user);
    }

    const id = await idGenerator();
    const {
      token, refreshToken,
    } = await this.userCreateTokenService.execute(id, email);

    const newUser = await this.createNewUser(id, payload, refreshToken);
    return {
      token,
      refreshToken,
      user: this.userTransformService.execute(newUser),
    };
  }

  async findOldUser(email: string) {
    const userGet = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        profileImage: true,
        coverImage: true,
      },
    });
    return userGet;
  }

  async createNewUser(id: bigint, payload: RegisterPayloadDto, refreshToken: string): Promise<UserQueryDto> {
    const {
      email, password, firstName, lastName, profileImage, coverImage,
    } = payload;
    const salfRounds = this.configService.get('saltRounds');
    const {
      salt, passwordHashed,
    } = await passwordHasher(password, email, salfRounds);
    const fullName = `${ firstName } ${ lastName }`;

    const profileImageId = profileImage
      ? await this.createImage(profileImage.url, profileImage.code)
      : undefined;
    const coverImageId = coverImage
      ? await this.createImage(coverImage.url, coverImage.code)
      : undefined;
    try {
      const userCreateDataInput: Prisma.UserCreateInput = {
        id,
        email,
        userName: id.toString(),
        firstName,
        lastName,
        fullName,
        salt,
        hashPassword: passwordHashed,
        refreshToken,
        profileImage: profileImageId ? {
          connect: {
            id: profileImageId,
          },
        } : undefined,
        coverImage: coverImageId ? {
          connect: {
            id: coverImageId,
          },
        } : undefined,
      };

      const newUser = await this.prismaService.user.create({
        data: userCreateDataInput,
        include: {
          profileImage: true,
          coverImage: true,
        },
      });
      return newUser;
    } catch (error) {
      throw new ConflictException('Can\'t create user');
    }
  }

  async createImage(url: string, code?: string): Promise<bigint> {
    const id = await idGenerator();
    try {
      const image = await this.prismaService.image.create({
        data: {
          id,
          code,
          url,
        },
      });

      return image.id;
    } catch (error) {
      throw new ConflictException('Can\'t create image');
    }
  }
}
