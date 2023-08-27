import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MediaService } from "./media.service";
import { JwtTokenGuard } from "../auth/guards/jwtToken.guard";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtTokenGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post("upload")
  @HttpCode(HttpStatus.OK)
  async upload(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return await this.mediaService.upload(req.user, file);
  }
}
