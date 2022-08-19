import { PrismaClient } from "@prisma/client";
import { BaseError } from "../../exceptions/BaseError";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { TokenUser } from "../../pkgs/GeneratorToken";
import { RedisClientType } from "../../pkgs/RedisClient";

const removeTokenFromBlackList = async function(redisClient: RedisClientType, userId: bigint): Promise<void> {
  const getUser = await redisClient.get(userId.toString());
  if (getUser) {
    try {
      await redisClient.del(userId.toString());
    } catch (error) {
      throw new BaseError(400, "Can't not delete token in blacklist");
    }
  }
}

export const LogoutInteractor = async function (redisClient: RedisClientType, tokenUser: TokenUser): Promise<void> {
  if (!tokenUser || !tokenUser.id) {
    throw new BaseError(401, "Can't access this resource");
  }

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      id: BigInt(tokenUser.id),
    }
  });

  if (!user) {
    throw new NotFoundError("User is not exists");
  }

  await prisma.user.update({
    data: {
      refreshToken: null,
    },
    where: {
      id: BigInt(tokenUser.id),
    }
  });

  await removeTokenFromBlackList(redisClient, BigInt(tokenUser.id));
}