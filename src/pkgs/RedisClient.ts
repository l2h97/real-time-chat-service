import { Configs } from "../configs/Configs";
import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;

export const RedisClient = function(configs: Configs): RedisClientType {
  const redisClient: RedisClientType = createClient({
    url: `redis://${configs.redisHost}:${configs.redisPort}`
  });
  redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis connect failed", err));
  
  return redisClient;
}