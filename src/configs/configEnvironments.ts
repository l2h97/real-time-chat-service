import { Configs } from './configs';

export const configEnvironments = (): Configs => ({
  port: Number(process.env.PORT) || 3001,

  saltRounds: Number(process.env.SALT_ROUNDS) || 10,

  jwtTokenKey: process.env.JWT_TOKEN_KEY || 'realTimeChatAppToken',
  jwtTokenExpiredIn: Number(process.env.TOKEN_EXPIRED_IN) || 300,
  jwtRefreshTokenKey: process.env.JWT_REFRESH_TOKEN_KEY || 'readTimeChatAppRefreshToken',
  jwtRefreshTokenExpiredIn: Number(process.env.REFRESH_TOKEN_EXPIRED_IN) || 1296000,

  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: Number(process.env.REDIS_PORT) || 6379,
});
