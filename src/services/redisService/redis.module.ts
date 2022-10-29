import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ RedisService, ConfigService ],
})
export class RedisModule {}
