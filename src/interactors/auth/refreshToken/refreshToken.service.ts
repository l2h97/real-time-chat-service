import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configs } from "src/configs/configs";
import { BadRequestException } from "src/exceptions/badRequest.exception";
import { ForbiddenException } from "src/exceptions/forbidden.exception";
import { NotFoundException } from "src/exceptions/notFound.exception";
import { PrismaService } from "src/services/prismaService/prisma.service";
import {
  AuthUserDto,
  TokenService,
} from "src/services/tokenService/token.service";
import { UserAuthResDto } from "../common/userAuthResDto";
import { UserCreateTokenService } from "../common/userCreateToken.service";
import { UserTransformService } from "../common/userTransform.service";

@Injectable()
export class RefreshTokenService {
  constructor(
    private prismaService: PrismaService,
    private userCreateTokenService: UserCreateTokenService,
    private tokenService: TokenService,
    private configService: ConfigService<Configs, true>,
    private userTransformService: UserTransformService,
  ) {}

  async execute(authUser: AuthUserDto): Promise<UserAuthResDto> {
    if (!authUser || !authUser.id) {
      throw new ForbiddenException("Can't not access this resource");
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: BigInt(authUser.id),
      },
      include: {
        profileImage: true,
        coverImage: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User is not found");
    }

    if (!user.refreshToken) {
      throw new BadRequestException("Token is not found");
    }

    const tokenPayload: AuthUserDto = {
      id: user.id.toString(),
      email: user.email,
      userName: user.userName,
    };
    const token = await this.tokenService.genToken(tokenPayload);
    const expiredToken: number = this.configService.get("jwtTokenExpiredIn");
    await this.userCreateTokenService.addTokenToBlackList(
      user.id,
      token,
      expiredToken,
    );

    return {
      token,
      refreshToken: user.refreshToken,
      user: this.userTransformService.execute(user),
    };
  }
}
