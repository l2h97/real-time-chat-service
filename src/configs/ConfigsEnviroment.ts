import { Configs } from "./Configs";

require("dotenv").config();

export const ConfigsEnviroment: Configs = {
  service: process.env.SERVICE || "realTimeChatApp",
  port: Number(process.env.PORT) || 3001,

  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:Password@localhost:5432/real-time-db?schema=public",

  jwtTokenKey: process.env.JWT_TOKEN_KEY || "realTimeChatApp",
  jwtRefreshTokenKey: process.env.JWT_REFRESH_TOKEN_KEY || "readTimeChatAppRefreshToken",
  tokenLife: Number(process.env.TOKEN_LIFE) || 1800,
  refreshTokenLife: Number(process.env.REFRESH_TOKEN_FILE) || 7889238,

  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: Number(process.env.REDIS_PORT) || 6379,
}