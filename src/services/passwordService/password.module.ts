import { Module } from "@nestjs/common";
import { PasswordService } from "./password.service";
import { ConfigurationModule } from "../../configs/configuration.module";

@Module({
  imports: [ConfigurationModule],
  controllers: [],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
