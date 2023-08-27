import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";
import { LocalUploadMediaService } from "src/services/uploadMedia/localUploadMedia.service";
import { TransformMediaResponse } from "../users/transformProfile/transformProfile.service";

@Injectable()
export class MediaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly localUploadMediaService: LocalUploadMediaService,
    private readonly transformMediaResponse: TransformMediaResponse,
  ) {}

  async upload(authUser: IAuthUser, media: Express.Multer.File) {
    const { code, url } = await this.localUploadMediaService.storeImage(media);

    const mediaCreated = await this.prismaService.media.create({
      data: {
        code,
        url,
        createdBy: {
          connect: {
            id: authUser.id,
          },
        },
      },
    });

    return this.transformMediaResponse.transform(mediaCreated);
  }
}
