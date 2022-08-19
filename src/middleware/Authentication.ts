import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Configs } from "../configs/Configs";
import { TokenUser } from "../pkgs/GeneratorToken";

export const Authentication = function(req: Request, res: Response, next: NextFunction, configs: Configs) {
  // if (token) {
  //   jwt.verify(token, configs.jwtTokenKey, function(err, decode) {
  //     if (err) {
  //       res.status(401).json({ statusCode: 401, message: "Unauthorized access."})
  //     }
  //     next();
  //   });
  // }
  // res.status(403).json({ statusCode: 403, message: "No token provided." })
  const token = req.headers.authorization || "";
  if (!token) {
    const anonymousUser: TokenUser = {
      id: "",
      email: "",
      fullName: "",
    }
    req.user = anonymousUser;
    next();
  }
  const userToken = jwt.verify(token, configs.jwtTokenKey);
  if (userToken) {
    req.user = userToken;
    next();
  }
}