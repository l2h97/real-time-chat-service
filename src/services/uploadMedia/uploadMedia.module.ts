import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { LocalUploadMediaService } from "./localUploadMedia.service";
import { ConfigurationModule } from "src/configs/configuration.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../..", "public"),
      exclude: ["/api/(.*)"],
      serveRoot: "/media",
    }),
    ConfigurationModule,
  ],
  controllers: [],
  providers: [LocalUploadMediaService],
  exports: [LocalUploadMediaService],
})
export class UploadMediaModule {}
