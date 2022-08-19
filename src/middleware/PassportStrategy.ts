import { Request } from "express";
import { VerifyCallback } from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { TokenUser } from "../pkgs/GeneratorToken";
import { RedisClientType } from "../pkgs/RedisClient";

export const PassportStrategy = async function(redisClient: RedisClientType, jwtTokenKey: string) {
  const passportOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtTokenKey,
    passReqToCallback: true,
  };

  passport.use(new Strategy(passportOptions, (req: Request, tokenUser: TokenUser, done: VerifyCallback) => {
    if (!tokenUser) {
      const anonymousUser: TokenUser = {
        id: "",
        email: "",
        fullName: ""
      }
      return done(null, anonymousUser);
    }

    return done(null, tokenUser);
  }))
}