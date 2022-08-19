export interface Configs {
  service: string,
  port: number,

  databaseUrl: string,

  jwtTokenKey: string,
  jwtRefreshTokenKey: string,
  tokenLife: number,
  refreshTokenLife: number,

  redisHost: string,
  redisPort: number,
}