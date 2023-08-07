import { IConfigs } from "./configs";

export const configEnvironments = (): IConfigs => {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT) ?? 3001,

    postgresDatabaseUrl:
      process.env.DATABASE_URL ??
      "postgresql://admin:Password@localhost:5432/real-time-db?schema=public",
    postgresHost: process.env.POSTGRES_HOST ?? "localhost",
    postgresPort: Number(process.env.POSTGRES_PORT) ?? 5432,
    postgresDb: process.env.POSTGRES_DB ?? "real-time-db",
    postgresUser: process.env.POSTGRES_USER ?? "admin",
    postgresPassword: process.env.POSTGRES_PASSWORD ?? "Password",
    postgresDbTest: process.env.POSTGRES_DB_TEST ?? "real-time-db-test",
    postgresDbTestUrl:
      process.env.DATABASE_TEST_URL ??
      "postgresql://admin:Password@localhost:5432/real-time-db-test?schema=public",

    saltRounds: Number(process.env.SALT_ROUNDS) ?? 10,
    jwtTokenKey: process.env.JWT_TOKEN_KEY ?? "realTimeChatJwtToken",
    jwtTokenExpiredIn: Number(process.env.JWT_TOKEN_EXPIRED_IN) ?? 1800,
    jwtRefreshTokenKey:
      process.env.JWT_REFRESH_TOKEN_KEY ?? "readTimeChatJwtRefreshToken",
    jwtRefreshTokenExpiredIn:
      Number(process.env.JWT_REFRESH_TOKEN_EXPIRED_IN) ?? 1296000,

    redisHost: process.env.REDIS_HOST ?? "localhost",
    redisPort: Number(process.env.REDIS_PORT) ?? 6379,

    avatarGenerateUrl:
      process.env.AVATAR_GENERATE_URL ?? "https://avatars.abstractapi.com/v1",
    avatarGenerateKey:
      process.env.AVATAR_GENERATE_KEY ?? "0bc8aec6d59f4ebfac48ad24c7a38d0e",
  };
};
