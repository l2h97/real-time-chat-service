export interface IConfigs {
  nodeEnv: string;
  port: number;

  postgresDatabaseUrl: string;
  postgresHost: string;
  postgresPort: number;
  postgresDb: string;
  postgresUser: string;
  postgresPassword: string;
  postgresDbTest: string;
  postgresDbTestUrl: string;

  saltRounds: number;
  jwtTokenKey: string;
  jwtTokenExpiredIn: number;
  jwtRefreshTokenKey: string;
  jwtRefreshTokenExpiredIn: number;

  redisHost: string;
  redisPort: number;

  avatarGenerateUrl: string;
  avatarGenerateKey: string;

  imageBaseUrl: string;
  imageMaxSize: number;
  videoBaseUrl: string;
  videoMaxSize: number;
}
