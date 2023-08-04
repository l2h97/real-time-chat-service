import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { RegisterPayload } from "./register.payload";
import { Prisma } from "@prisma/client";

const myProfileQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    profileImage: true,
  }
})

@Injectable class TransformMyProfile extends  {

}

@Injectable()
export class RegisterService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(payload: RegisterPayload) {
    const { email, password } = payload;

    const user = await this.findUser(email);

    if (user) {

    }
  }

  async findUser(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        profileImage: true,
      },
    });

    return user;
  }
}
