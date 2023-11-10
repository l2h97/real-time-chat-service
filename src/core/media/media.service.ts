import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { IAuthUser } from "src/services/tokenService/authUser.interface";
import { LocalUploadMediaService } from "src/services/uploadMedia/localUploadMedia.service";
import { TransformMediaResponse } from "../users/transformProfile/transformProfile.service";
import { CloudinaryService } from "src/services/uploadMedia/cloudinary.service";
import { UploadMediaException } from "src/exceptions/conflictExceptions/uploadMedia.exception";
import { StoreMediaException } from "src/exceptions/conflictExceptions/storeMedia.exception";
import { Prisma } from "@prisma/client";
import sharp from "sharp";
import { ImageTypeException } from "src/exceptions/badRequestExceptions/imageType.exception";

@Injectable()
export class MediaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly localUploadMediaService: LocalUploadMediaService,
    private readonly transformMediaResponse: TransformMediaResponse,
    private readonly cloudinaryService: CloudinaryService,
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

  async uploads(authUser: IAuthUser, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return [];
    }

    for (const item of files) {
      const validType = this.imageTypeValidator(item);
      if (!validType) {
        throw new ImageTypeException();
      }
    }
    const images = await Promise.all(
      files.map(async (item) => {
        try {
          const imageName = this.cloudinaryService.createImageCode(item);
          const imageCompression = await this.imageSizeCompression(item);
          const base64Image = this.cloudinaryService.base64TransformImage(
            imageCompression,
            item.mimetype,
          );

          return await this.cloudinaryService.uploadImageFromBuffer(
            base64Image,
            imageName,
          );
        } catch (error) {
          throw new UploadMediaException();
        }
      }),
    );

    if (!images || images.length === 0) {
      throw new UploadMediaException();
    }

    try {
      return await this.prismaService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          return await Promise.all(
            images.map(async (item) => {
              const media = await tx.media.create({
                data: {
                  code: item.code,
                  url: item.url,
                  userId: authUser.id,
                },
              });

              return this.transformMediaResponse.transform(media);
            }),
          );
        },
      );
    } catch (error) {
      throw new StoreMediaException();
    }
  }

  imageTypeValidator(image: Express.Multer.File) {
    const checkFileTypeRegex = /.(jpg|jpeg|png|gif|webp)/g;
    return checkFileTypeRegex.test(image.mimetype);
  }

  async imageSizeCompression(image: Express.Multer.File): Promise<Buffer> {
    const compressedObject = await sharp(image.buffer)
      .resize(1280, 720)
      .webp({ quality: 50 })
      .toBuffer();
    return compressedObject;
  }
}
