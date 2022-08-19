import { GeneratorToken, TokenUser } from "../../pkgs/GeneratorToken"
import jwt from "jsonwebtoken";
import { Configs } from "../../configs/Configs";
import { PrismaClient } from "@prisma/client";
import { BaseError } from "../../exceptions/BaseError";
import { NotFoundError } from "../../exceptions/NotFoundError";

export const RefreshTokenInteractor = async function (prisna: PrismaClient, refreshToken: string, configs: Configs): Promise<string> {
  if (!refreshToken) {
    throw new BaseError(400, "refresh token should not empty");
  }

  const user = await prisna.user.findFirst({
    where: {
      refreshToken,
    }
  });
  if(!user) {
    throw new NotFoundError("User is not found");
  }

  const refreshTokenVerified = await jwt.verify(refreshToken, configs.jwtRefreshTokenKey) as TokenUser;

  if(!refreshTokenVerified) {
    throw new BaseError(400, "Connot vefiry this token");
  }
  
  const { id, email, fullName } = refreshTokenVerified
  const newAccessToken = await GeneratorToken(BigInt(id), email, fullName, configs);

  if(!newAccessToken) {
    throw new BaseError(400, "Cannot sign a new access token");
  }

  return newAccessToken;
}