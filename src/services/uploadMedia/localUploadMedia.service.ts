import { Injectable } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { mkdir, stat, writeFile } from "fs/promises";
import { join } from "path";
import { ConfigurationService } from "src/configs/configuration.service";
import { ConflictException } from "src/exceptions/conflict.exception";

export interface IMedia {
  code: string;
  url: string;
  type: MediaType;
}

@Injectable()
export class LocalUploadMediaService {
  private imageBaseUrl: string;
  private imageDir: string;
  private videoBaseUrl: string;
  private videoDir: string;

  constructor(private readonly configurationService: ConfigurationService) {
    this.imageBaseUrl = configurationService.imageBaseUrl;
    this.imageDir = join(__dirname, "../../..", "public/images");
    this.videoBaseUrl = configurationService.videoBaseUrl;
    this.videoDir = join(__dirname, "../../..", "public/videos");
  }

  async storeImage(image: Express.Multer.File): Promise<IMedia> {
    const isExistsDir = await this.isExistsDir(this.imageDir);

    if (!isExistsDir) {
      try {
        await mkdir(this.imageDir, { recursive: true });
      } catch (error) {
        throw new ConflictException("error while store image");
      }
    }

    const { code, url, type, fileName } = this.createMediaObj(
      image,
      this.imageBaseUrl,
      MediaType.IMAGE,
    );

    const imageFile = `${this.imageDir}/${fileName}`;
    try {
      await writeFile(imageFile, image.buffer);
    } catch (error) {
      throw new ConflictException("Can't save image to server");
    }

    return {
      code,
      url,
      type,
    };
  }

  async isExistsDir(dir: string): Promise<boolean> {
    try {
      const statDir = await stat(dir);

      return statDir.isDirectory();
    } catch (error) {
      return false;
    }
  }

  createMediaObj(
    media: Express.Multer.File,
    url: string,
    type: MediaType,
  ): IMedia & { fileName: string } {
    const code = `${new Date().getTime()}-${
      Math.floor(Math.random() * 900000000) + 100000000
    }`;

    const fileType = media.originalname.split(".")[1];
    const fileName = `${code}.${fileType}`;
    const imageUrl = `${url}/${fileName}`;

    return {
      code,
      url: imageUrl,
      type,
      fileName,
    };
  }
}
