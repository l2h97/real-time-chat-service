import { IConfigs } from "./configs";

export const configEnvironments = (): IConfigs => {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 3001,

    postgresDatabaseUrl:
      process.env.DATABASE_URL ||
      "postgresql://admin:bQ5UroNM9PqslBs@localhost:5432/rtc_db?schema=public",
    postgresHost: process.env.POSTGRES_HOST || "localhost",
    postgresPort: Number(process.env.POSTGRES_PORT) || 5432,
    postgresDb: process.env.POSTGRES_DB || "rtc_db",
    postgresUser: process.env.POSTGRES_USER || "admin",
    postgresPassword: process.env.POSTGRES_PASSWORD || "bQ5UroNM9PqslBs",
    postgresDbTest: process.env.POSTGRES_DB_TEST || "rtc_db_test",
    postgresDbTestUrl:
      process.env.DATABASE_TEST_URL ||
      "postgresql://admin:bQ5UroNM9PqslBs@localhost:5432/rtc_db_test?schema=public",

    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
    jwtTokenKey: process.env.JWT_TOKEN_KEY || "realTimeChatJwtToken",
    jwtTokenExpiredIn: Number(process.env.JWT_TOKEN_EXPIRED_IN) || 1800,
    jwtRefreshTokenKey:
      process.env.JWT_REFRESH_TOKEN_KEY || "readTimeChatJwtRefreshToken",
    jwtRefreshTokenExpiredIn:
      Number(process.env.JWT_REFRESH_TOKEN_EXPIRED_IN) || 1296000,

    redisHost: process.env.REDIS_HOST || "localhost",
    redisPort: Number(process.env.REDIS_PORT) || 6379,

    avatarGenerateUrl:
      process.env.AVATAR_GENERATE_URL || "https://avatars.abstractapi.com/v1",
    avatarGenerateKey:
      process.env.AVATAR_GENERATE_KEY || "7abc2b0f2b164f9da29a68917f805c9b",

    imageBaseUrl:
      process.env.IMAGE_BASE_URL || "http://localhost:3001/media/images",
    imageMaxSize: Number(process.env.IMAGE_MAX_SIZE) || 2000000,
    videoBaseUrl:
      process.env.VIDEO_BASE_URL || "http://localhost:3001/media/videos",
    videoMaxSize: Number(process.env.VIDEO_MAX_SIZE) || 10000000,

    cloudinaryName: process.env.CLOUDINARY_NAME || "dzuflv2fo",
    cloudinaryKey: process.env.CLOUDINARY_KEY || "432543737464374",
    cloudinarySecret:
      process.env.CLOUDINARY_SECRET || "_xskDAArMFAnCW7qOngzr3yF33A",

    esHost: process.env.ES_HOST || "localhost",
    esPort: Number(process.env.ES_PORT) || 9200,
    esUrl: process.env.ES_URL || "http://localhost:9200",
  };
};
