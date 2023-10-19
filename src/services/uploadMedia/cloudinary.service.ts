import { Injectable } from "@nestjs/common";
import { v2 } from "cloudinary";
import { ConfigurationService } from "src/configs/configuration.service";
import { LoggerService } from "../loggerService/logger.service";
import { generateImageCode } from "src/helpers/generateImageCode";
import { IMedia, MEDIA_TYPE } from "./localUploadMedia.service";

@Injectable()
export class CloudinaryService {
  private cloudinary = v2;
  private cloudinaryFolder = "rtc_assets/images";

  constructor(
    private readonly configurationService: ConfigurationService,
    private loggerService: LoggerService,
  ) {
    this.cloudinary.config({
      cloud_name: configurationService.cloudinaryName,
      api_key: configurationService.cloudinaryKey,
      api_secret: configurationService.cloudinarySecret,
      secure: true,
    });
  }

  async upload(image: Express.Multer.File): Promise<IMedia | undefined> {
    try {
      const imageName = this.createImageCode(image);
      const base64Image = this.base64TransformImage(image);
      const result = await this.cloudinary.uploader.upload(base64Image, {
        folder: this.cloudinaryFolder,
        resource_type: "image",
        public_id: imageName,
      });

      return {
        code: imageName,
        url: result.url,
        type: MEDIA_TYPE.IMAGE,
      };
    } catch (error) {
      this.loggerService.error("CloudinaryService::upload", error);
    }
  }

  async uploadMultiple(images: Express.Multer.File[]): Promise<IMedia[]> {
    try {
      return await Promise.all(
        images.map(async (item) => {
          const imageName = this.createImageCode(item);
          const base64Image = this.base64TransformImage(item);
          const result = await this.cloudinary.uploader.upload(base64Image, {
            folder: this.cloudinaryFolder,
            resource_type: "image",
            public_id: imageName,
          });

          return {
            code: imageName,
            url: result.url,
            type: MEDIA_TYPE.IMAGE,
          };
        }),
      );
    } catch (error) {
      this.loggerService.error("CloudinaryService::upload", error);
      return [];
    }
  }

  base64TransformImage(image: Express.Multer.File): string {
    const base64Image = Buffer.from(image.buffer).toString("base64");
    return `data:${image.mimetype};base64,${base64Image}`;
  }

  createImageCode(image: Express.Multer.File) {
    const imageName = image.filename;
    return generateImageCode(imageName);
  }
}
