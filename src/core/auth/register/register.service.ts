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

@Injectable()
export class RegisterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transformMyProfileResponse: TransformMyProfileResponse,
    private readonly passwordService: PasswordService,
    private readonly loggerService: LoggerService,
    private readonly searchService: SearchService,
  ) {}

  async execute(payload: RegisterPayload) {
    const { email, password } = payload;
    const user = await this.findUser(email);

    this.loggerService.log("user::RegisterService::", user);

    if (user) {
      await this.createSearchDoc(user);
      return this.transformMyProfileResponse.transform(user);
    }

    const newUser = await this.createUser(email, password);
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

  async createUser(email: string, password: string) {
    const { salt, passwordHashed } =
      await this.passwordService.hashPassword(password);

    const userCreateInput: Prisma.UserCreateInput = {
      email,
      salt,
      passwordHashed,
      profileImage: {
        create: {
          code: "hehe",
          url: "hehehe",
        },
      },
    };

    const user = await this.prismaService.user.create({
      data: userCreateInput,
      ...profileQuery,
    });

    return user;
  }

  async createSearchDoc(user: ProfileQuery): Promise<void> {
    const document: ISearchUser = {
      id: user.id.toString(),
      fullName: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      },
      email: user.email,
      profileImage: user.profileImage?.url || "",
    };
    await this.searchService.indexUsers(document);
  }
}
