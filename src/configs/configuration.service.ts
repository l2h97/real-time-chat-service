import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IConfigs } from "src/configs/configs";

@Injectable()
export class ConfigurationService implements IConfigs {
  constructor(private configService: ConfigService<IConfigs, true>) {}

  get nodeEnv(): string {
    return this.configService.get<string>("nodeEnv");
  }

  get port(): number {
    return this.configService.get<number>("port");
  }

  get postgresDatabaseUrl(): string {
    return this.configService.get<string>("postgresDatabaseUrl");
  }

  get postgresHost(): string {
    return this.configService.get<string>("postgresHost");
  }

  get postgresPort(): number {
    return this.configService.get<number>("postgresPort");
  }

  get postgresDb(): string {
    return this.configService.get<string>("postgresDb");
  }

  get postgresUser(): string {
    return this.configService.get<string>("postgresUser");
  }

  get postgresPassword(): string {
    return this.configService.get<string>("postgresPassword");
  }
  get postgresDbTest(): string {
    return this.configService.get<string>("postgresDbTest");
  }

  get postgresDbTestUrl(): string {
    return this.configService.get<string>("postgresDbTestUrl");
  }

  get saltRounds(): number {
    return this.configService.get<number>("saltRounds");
  }

  get jwtTokenKey(): string {
    return this.configService.get<string>("jwtTokenKey");
  }

  get jwtTokenExpiredIn(): number {
    return this.configService.get<number>("jwtTokenExpiredIn");
  }

  get jwtRefreshTokenKey(): string {
    return this.configService.get<string>("jwtRefreshTokenKey");
  }

  get jwtRefreshTokenExpiredIn(): number {
    return this.configService.get<number>("jwtRefreshTokenExpiredIn");
  }

  get redisHost(): string {
    return this.configService.get<string>("redisHost");
  }

  get redisPort(): number {
    return this.configService.get<number>("redisPort");
  }

  get avatarGenerateUrl(): string {
    return this.configService.get<string>("avatarGenerateUrl");
  }

  get avatarGenerateKey(): string {
    return this.configService.get<string>("avatarGenerateKey");
  }

  get imageBaseUrl(): string {
    return this.configService.get<string>("imageBaseUrl");
  }

  get imageMaxSize(): number {
    return this.configService.get<number>("imageMaxSize");
  }

  get videoBaseUrl(): string {
    return this.configService.get<string>("videoBaseUrl");
  }

  get videoMaxSize(): number {
    return this.configService.get<number>("videoMaxSize");
  }
}
