import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { LocalUploadMediaService } from "./localUploadMedia.service";
import { ConfigurationModule } from "src/configs/configuration.module";
import { CloudinaryService } from "./cloudinary.service";
import { LoggerModule } from "../loggerService/logger.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../..", "public"),
      exclude: ["/api/(.*)"],
      serveRoot: "/media",
    }),
    ConfigurationModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [LocalUploadMediaService, CloudinaryService],
  exports: [LocalUploadMediaService, CloudinaryService],
})
export class UploadMediaModule {}
