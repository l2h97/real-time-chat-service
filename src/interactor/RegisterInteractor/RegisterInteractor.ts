import { PrismaClient } from "@prisma/client"
import { Configs } from "../../configs/Configs";
import { BaseError } from "../../exceptions/BaseError";
import { GeneratorId } from "../../pkgs/GeneratorId";
import { GeneratorRefreshToken, GeneratorToken } from "../../pkgs/GeneratorToken";
import { Hasher } from "../../pkgs/Hasher";
import { RedisClientType } from "../../pkgs/RedisClient";
import { setTokenFromBlacklist } from "../setTokenFromBlacklist";
import { RegisterInteractorPayload } from "./RegisterInteractorPayload";
import { RegisterInteractorResponse } from "./RegisterInteractorResponse";

async function getUser(prismaClient: PrismaClient, email: string) {
  const user = await prismaClient.user.findFirst({
    where: {
      email,
    }
  });

  return user;
}

async function createUser(prismaClient: PrismaClient, payload: RegisterInteractorPayload, configs: Configs) {
  const { email, fullName, password }  = payload
  // const id = new GeneratorId().getId();
  const id = GeneratorId();
  // const { salt, hashPassword } = new Hasher().hash(email, password);
  const { salt, hashPassword } = Hasher(email, password);
  const refreshToken = await GeneratorRefreshToken(id, email, fullName, configs);
  try {
    const user = await prismaClient.user.create({
      data: {
        id,
        email,
        fullName,
        salt,
        hashPassword,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        refreshToken,
      }
    });

    return user;
  } catch {
    console.log("create user fail");
  }
}

export const RegisterInteractor = async function(payload: RegisterInteractorPayload, configs: Configs, redisClient: RedisClientType): Promise<{ response: RegisterInteractorResponse, token?: string, refreshToken?: string }> {
  const prisma = new PrismaClient();
  const oldUser = await getUser(prisma, payload.email);
  if (oldUser) {
    return {
      response: {
        id: oldUser.id.toString(),
        email: oldUser.email,
        fullName: oldUser.fullName,
        createdAt: oldUser.createdAt.toISOString(),
        updatedAt: oldUser.updatedAt.toISOString(),
        isExistsEmail: true,
      }
    }
  }

  const user = await createUser(prisma, payload, configs);

  if (!user) {
    throw new BaseError(500, "Create user failed")
  }

  const token = await GeneratorToken(user.id, user.email, user.fullName, configs);
  await setTokenFromBlacklist(redisClient, user.id, token);

  return {
    response: {
      id: user.id.toString(),
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    token,
    refreshToken: user.refreshToken || "",
  }
}

// const getTokenToBlackList = async function(redisClient: RedisClientType, userId: BigInt, token: string): Promise<void> {
//   const getUser = await redisClient.get(userId.toString());
//   if (!getUser) {
//     const tokenValue = [token]
//     await redisClient.set(userId.toString(), JSON.stringify(tokenValue))
//   }

//   const tokenValue = 
// }

