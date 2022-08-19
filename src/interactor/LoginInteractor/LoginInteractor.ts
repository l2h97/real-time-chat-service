import { PrismaClient } from "@prisma/client";
import { Configs } from "../../configs/Configs";
import { BaseError } from "../../exceptions/BaseError";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { Comparer } from "../../pkgs/Comparer";
import { GeneratorRefreshToken, GeneratorToken } from "../../pkgs/GeneratorToken";
import { RedisClientType } from "../../pkgs/RedisClient";
import { LoginInteractorPayload } from "./LoginInteractorPayload";
import { LoginInteractorReponse } from "./LoginInteractorReponse";
import { setTokenFromBlacklist } from "../setTokenFromBlacklist";

export const LoginInteractor = async function(payload: LoginInteractorPayload, configs: Configs, redisClient: RedisClientType): Promise<{ response: LoginInteractorReponse, token: string, refreshToken: string }> {
  const { email, password } = payload;
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundError("User is not exists");
  }

  if (!Comparer(email, password, user.hashPassword)) {
    throw new BaseError(401, "Invalid credencial");
  }

  const token = await GeneratorToken(user.id, user.email, user.fullName, configs);
  const refreshToken = await GeneratorRefreshToken(user.id, user.email, user.fullName, configs);
  await prisma.user.update({
    data: {
      refreshToken,
    },
    where: {
      id: user.id,
    }
  });

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
    refreshToken,
  }
}

