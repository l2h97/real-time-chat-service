export type Configs = {
  port: number;
  nodeEnv: string;

  databaseUrl: string;
  postgresHost: string;
  postgresPort: number;
  postgresDb: string;
  postgresUser: string;
  postgresPassword: string;
  postgresDbTest: string;
  databaseTestUrl: string;

  saltRounds: number;

  jwtTokenKey: string;
  jwtTokenExpiredIn: number;
  jwtRefreshTokenKey: string;
  jwtRefreshTokenExpiredIn: number;

  redisHost: string;
  redisPort: number;

  genAvatarsUrl: string;
  genAvatarsApiKey: string;
};
