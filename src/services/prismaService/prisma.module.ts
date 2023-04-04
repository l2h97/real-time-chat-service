import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "./prisma.service";

@Module({
  exports: [],
  controllers: [],
  providers: [PrismaService, ConfigService],
})
export class PrismaModule {}
