import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./token.service";

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService, JwtService, TokenService],
})
export class TokenModule {}
