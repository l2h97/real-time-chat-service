import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { PrismaModule } from "src/services/prismaService/prisma.module";
import { UserModule } from "../users/user.module";
import { UploadMediaModule } from "src/services/uploadMedia/uploadMedia.module";
import { TokenModule } from "src/services/tokenService/token.module";

@Module({
  imports: [PrismaModule, UserModule, UploadMediaModule, TokenModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [],
})
export class MediaModule {}
