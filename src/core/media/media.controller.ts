import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MediaService } from "./media.service";
import { JwtTokenGuard } from "../auth/guards/jwtToken.guard";
import { Request } from "express";
import { FilesInterceptor } from "@nestjs/platform-express";

@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtTokenGuard)
  @UseInterceptors(FilesInterceptor("files"))
  @Post("uploads")
  @HttpCode(HttpStatus.OK)
  async uploads(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.mediaService.uploads(req.user, files);
  }
}
