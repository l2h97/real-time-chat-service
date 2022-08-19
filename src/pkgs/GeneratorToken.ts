import { Configs } from "../configs/Configs";
import jwt from "jsonwebtoken";

export interface TokenUser extends jwt.JwtPayload {
  id: string,
  email: string,
  fullName: string,
}

// export class GeneratorToken {
//   constructor() {}


// }

export const GeneratorToken = async function(id: bigint, email: string, fullName: string, configs: Configs): Promise<string> {
  const payload: TokenUser = {
    id: id.toString(),
    email,
    fullName,
  };
  const jwtTokenKey = configs.jwtTokenKey;
  const token = await jwt.sign(payload, jwtTokenKey, { expiresIn: configs.tokenLife });

  return token;
}

export const GeneratorRefreshToken = async function(id: bigint, email: string, fullName: string, configs: Configs): Promise<string> {
  const payload: TokenUser = {
    id: id.toString(),
    email,
    fullName,
  };

  const jwtRefreshTokenKey = configs.jwtRefreshTokenKey;
  const refreshToken = await jwt.sign(payload, jwtRefreshTokenKey, { expiresIn: configs.refreshTokenLife });

  return refreshToken;
}