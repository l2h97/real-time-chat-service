export type Configs = {
  port: number;

  saltRounds: number;

  jwtTokenKey: string;
  jwtTokenExpiredIn: number;
  jwtRefreshTokenKey: string;
  jwtRefreshTokenExpiredIn: number;

  redisHost: string;
  redisPort: number;
}
