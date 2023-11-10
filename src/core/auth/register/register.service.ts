import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { RegisterPayload } from "./register.payload";
import { Prisma } from "@prisma/client";
import { PasswordService } from "src/services/passwordService/password.service";
import {
  ProfileQuery,
  TransformMyProfileResponse,
  profileQuery,
} from "src/core/users/transformProfile/transformProfile.service";
import { LoggerService } from "src/services/loggerService/logger.service";
import { SearchService } from "src/services/searchService/search.service";
import { ISearchUser } from "src/services/searchService/search.interface";
import { AvatarGenerateService } from "src/services/avatarGeneratorService/avatarGenerator.service";
import { ConflictException } from "src/exceptions/conflict.exception";
import { CloudinaryService } from "src/services/uploadMedia/cloudinary.service";
import { generateImageCode } from "src/helpers/generateImageCode";

@Injectable()
export class RegisterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transformMyProfileResponse: TransformMyProfileResponse,
    private readonly passwordService: PasswordService,
    private readonly loggerService: LoggerService,
    private readonly searchService: SearchService,
    private readonly avatarGenerateService: AvatarGenerateService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(payload: RegisterPayload) {
    const user = await this.findUser(payload.email);

    if (user) {
      await this.createSearchDoc(user);
      return this.transformMyProfileResponse.transform(user);
    }

    const newUser = await this.createUser(payload);
    await this.createSearchDoc(newUser);
    return this.transformMyProfileResponse.transform(newUser);
  }

  async findUser(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      ...profileQuery,
    });

    return user;
  }

  async createUser(payload: RegisterPayload) {
    const { email, password, lastName, firstName } = payload;
    const { salt, passwordHashed } =
      await this.passwordService.hashPassword(password);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const profileImage = await this.avatarGenerator(fullName);
    const userCreateInput: Prisma.UserCreateInput = {
      email,
      salt,
      firstName,
      lastName,
      fullName,
      passwordHashed,
      profileImage: {
        create: {
          code: profileImage.code,
          url: profileImage.url,
          type: profileImage.type,
        },
      },
    };

    const user = await this.prismaService.user.create({
      data: userCreateInput,
      ...profileQuery,
    });

    return user;
  }

  async avatarGenerator(fullName: string) {
    const image = await this.avatarGenerateService.avatarGenerator(fullName);
    if (!image) {
      throw new ConflictException("Error while generate profile photo");
    }

    const imageName = generateImageCode(fullName);
    const base64Image = this.cloudinaryService.base64TransformImage(
      image,
      "image/webp",
    );

    try {
      return await this.cloudinaryService.uploadImageFromBuffer(
        base64Image,
        imageName,
      );
    } catch (error) {
      throw new ConflictException("Error while generate profile photo");
    }
  }

  async createSearchDoc(user: ProfileQuery): Promise<void> {
    const document: ISearchUser = {
      id: user.id.toString(),
      fullName: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      },
      email: user.email,
      profileImage: user.profileImage.url || "",
    };
    await this.searchService.indexUsers(document);
  }
}
