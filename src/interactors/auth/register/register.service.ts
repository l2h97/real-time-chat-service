import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { Configs } from "src/configs/configs";
import { UserQueryDto } from "src/dtos/queryDtos/userQueryDto";
import { ConflictException } from "src/exceptions/conflict.exception";
import { idGenerator } from "src/pkgs/idGenerator";
import { passwordHasher } from "src/pkgs/passwordHasher";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { UserCreateTokenService } from "../common/userCreateToken.service";
import { UserTransformService } from "../common/userTransform.service";
import { RegisterPayloadDto } from "./registerPayloadDto";
import { UserAuthResDto } from "../common/userAuthResDto";
import { UserResponseDto } from "../common/userResponseDto";
import { sanitizeString } from "src/pkgs/sanitizeString";
import { BadRequestException } from "src/exceptions/badRequest.exception";

@Injectable()
export class RegisterService {
  constructor(
    private prismaService: PrismaService,
    private userCreateTokenService: UserCreateTokenService,
    private configService: ConfigService<Configs, true>,
    private userTransformService: UserTransformService
  ) {}

  async execute(
    payload: RegisterPayloadDto
  ): Promise<UserAuthResDto | UserResponseDto> {
    const { email } = payload;

    const user = await this.findOldUser(email);
    if (user) {
      return this.userTransformService.execute(user);
    }

    const id = await idGenerator();
    const { token, refreshToken } = await this.userCreateTokenService.execute(
      id,
      email
    );

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

  async createNewUser(
    id: bigint,
    payload: RegisterPayloadDto,
    refreshToken: string
  ): Promise<UserQueryDto> {
    console.log("id::", id.toString());

    const { email, password, firstName, lastName } = payload;
    const salfRounds = this.configService.get("saltRounds");
    const { salt, passwordHashed } = await passwordHasher(
      password,
      email,
      salfRounds
    );
    const firstNameNomalized = sanitizeString(firstName);
    const lastNameNomalized = sanitizeString(lastName);
    const fullName = `${firstNameNomalized} ${lastNameNomalized}`;
    const userName = `${fullName} ${id.toString()}`;
    const isUserNameExists = await this.isUserNameExists(userName);
    if (isUserNameExists) {
      throw new BadRequestException("Your userName is exists");
    }

    const profileImageId = await idGenerator();
    const profileImageName = `profile${fullName}`;
    const profileImageUrl = this.createImageUrl(profileImageName);

    const coverImageId = await idGenerator();
    const coverImageName = `cover${fullName}`;
    const coverImageNameUrl = this.createImageUrl(coverImageName);

    try {
      const userCreateDataInput: Prisma.UserCreateInput = {
        id,
        email,
        userName,
        firstName: firstNameNomalized,
        lastName: lastNameNomalized,
        fullName,
        salt,
        hashPassword: passwordHashed,
        refreshToken,
        profileImage: {
          create: {
            id: profileImageId,
            url: profileImageUrl,
          },
        },
        coverImage: {
          create: {
            id: coverImageId,
            url: coverImageNameUrl,
          },
        },
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
      throw new ConflictException("Can't create user");
    }
  }

  async isUserNameExists(userName: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        userName,
      },
    });

    return !!user;
  }

  createImageUrl(fullName: string): string {
    const genAvatarsUrl = this.configService.get<string>("genAvatarsUrl");
    const genAvatarsApiKey = this.configService.get<string>("genAvatarsApiKey");
    const url = `${genAvatarsUrl}/?api_key=${genAvatarsApiKey}&name=${fullName}`;
    return url;
  }
}
