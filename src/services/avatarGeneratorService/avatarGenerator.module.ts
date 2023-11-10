import { Module } from "@nestjs/common";
import { ConfigurationModule } from "src/configs/configuration.module";
import { AvatarGenerateService } from "./avatarGenerator.service";

@Module({
  imports: [ConfigurationModule],
  controllers: [],
  providers: [AvatarGenerateService],
  exports: [AvatarGenerateService],
})
export class AvatarGeneratorModule {}
