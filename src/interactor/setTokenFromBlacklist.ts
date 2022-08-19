import { RedisClientType } from "../pkgs/RedisClient";

export const setTokenFromBlacklist = async function(redisClient: RedisClientType, userId: BigInt, token: string): Promise<void> {
  const getUser = await redisClient.get(userId.toString());
  if (getUser) {
    await redisClient.del(userId.toString());
  }
  
  await redisClient.set(userId.toString(), token)
}