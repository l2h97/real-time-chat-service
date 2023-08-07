import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { RegisterPayload } from "./register.payload";
import { Media, Prisma } from "@prisma/client";
import { PasswordService } from "src/services/passwordService/password.service";

export const myProfileQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    profileImage: true,
    coverImage: true,
  },
});

export type MyProfileQuery = Prisma.UserGetPayload<typeof myProfileQuery>;

export interface MediaResponse {
  id: number;
  code: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyProfileResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profile: MediaResponse | null;
  cover: MediaResponse | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class TransformMediaResponse {
  transform(media: Media): MediaResponse {
    return {
      id: media.id,
      code: media.code || "",
      url: media.url,
      createdAt: media.createdAt.toISOString(),
      updatedAt: media.updatedAt.toISOString(),
    };
  }
}

@Injectable()
export class TransformMyProfileResponse {
  constructor(private transformMediaResponse: TransformMediaResponse) {}

  transform(myProfile: MyProfileQuery): MyProfileResponse {
    let fullName = myProfile.firstName || "";
    if (myProfile.lastName) {
      fullName += myProfile.lastName;
    }
    return {
      id: myProfile.id,
      email: myProfile.email,
      firstName: myProfile.firstName || "",
      lastName: myProfile.lastName || "",
      fullName,
      profile: myProfile.profileImage
        ? this.transformMediaResponse.transform(myProfile.profileImage)
        : null,
      cover: myProfile.coverImage
        ? this.transformMediaResponse.transform(myProfile.coverImage)
        : null,
      createdAt: myProfile.createdAt.toISOString(),
      updatedAt: myProfile.updatedAt.toISOString(),
    };
  }
}

@Injectable()
export class RegisterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transformMyProfileResponse: TransformMyProfileResponse,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(payload: RegisterPayload) {
    const { email, password } = payload;

    const user = await this.findUser(email);

    if (user) {
      return this.transformMyProfileResponse.transform(user);
    }

    const newUser = await this.createUser(email, password);
    return this.transformMyProfileResponse.transform(newUser);
  }

  async findUser(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      ...myProfileQuery,
    });

    return user;
  }

  async createUser(email: string, password: string) {
    const { salt, passwordHashed } = await this.passwordService.hashPassword(
      password,
    );

    const userCreateInput: Prisma.UserCreateInput = {
      email,
      salt,
      passwordHashed,
    };

    const user = await this.prismaService.user.create({
      data: userCreateInput,
      ...myProfileQuery,
    });

    return user;
  }
}
