import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configEnvironments } from "src/configs/configEnvironments";
import { ConfigurationService } from "./configuration.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configEnvironments],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
