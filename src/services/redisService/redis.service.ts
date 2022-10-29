import {
  Injectable, OnApplicationShutdown, OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@redis/client';
import { RedisClientType } from 'redis';
import { Configs } from 'src/configs/configs';

@Injectable()
export class RedisService implements OnApplicationShutdown, OnModuleInit {
  private redisClient: RedisClientType;

  public get client() {
    return this.redisClient;
  }

  public set client(value) {
    this.redisClient = value;
  }

  constructor(private configService: ConfigService<Configs, true>) {
    this.client = createClient({
      url: `redis://${ this.configService.get('redisHost') }:${ configService.get('redisPort') }`,
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onApplicationShutdown() {
    await this.client.quit();
  }
}
