import "express-async-errors";
import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Request, Response} from "express";
import passport from "passport";
import { Configs } from "./configs/Configs";
import { ConfigsEnviroment } from "./configs/ConfigsEnviroment";
import { LoginInteractor } from "./interactor/LoginInteractor/LoginInteractor";
import { RegisterInteractor } from "./interactor/RegisterInteractor/RegisterInteractor";
import { PassportStrategy } from "./middleware/PassportStrategy";
import passportAnonymous from "passport-anonymous"
import { TokenUser } from "./pkgs/GeneratorToken";
import { LogoutInteractor } from "./interactor/LogoutInteractor/LogoutInteractor";
import { RedisClient } from "./pkgs/RedisClient";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { BaseError } from "./exceptions/BaseError";
import { RefreshTokenInteractor } from "./interactor/RefreshTokenInteractor/RefreshTokenInteractor";
import { PrismaClient } from "@prisma/client";

const PORT = ConfigsEnviroment.port;
const configs: Configs = ConfigsEnviroment
const app: Express = express();
app.use(bodyParser.json());
app.use(cors())

const redisClient = RedisClient(configs);
const prisma = new PrismaClient();

PassportStrategy(redisClient, configs.jwtTokenKey);
passport.use(new passportAnonymous.Strategy())

app.get("/api/v1", passport.authenticate(["jwt", "anonymous"], { session: false }), (req: Request, res: Response) => {
  const user = req.user as TokenUser || "";
  if (!user || !user.id) {
    throw new BaseError(401, "Can't access this resource");
  }
  return res.status(200).json({ service: configs.service, status: "OK", userId: user.id || "" });
});

app.post("/api/v1/register", async (req: Request, res: Response) => {
  const { email, fullName, password } = req.body;
  const { response, token, refreshToken } = await RegisterInteractor({ email, fullName, password }, configs, redisClient);
  res.setHeader("Authorization", token || "");
  res.setHeader("Refresh-Token", refreshToken || "");
  return res.status(200).json(response);
});

app.post("/api/v1/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { response, token, refreshToken } = await LoginInteractor({ email, password }, configs, redisClient);
  res.setHeader("Authorization", token || "");
  res.setHeader("Refresh-Token", refreshToken || "");
  return res.status(200).json(response);
});



app.post("/api/v1/logout", passport.authenticate(["jwt", "anonymous"], { session: false }), async (req: Request, res: Response) => {
  const authUser: TokenUser = req.user as TokenUser || {
    id: "",
    email: "",
    fullName: "",
  }
  const tokenUser: TokenUser = {
    id: authUser.id || "",
    email: authUser.email || "",
    fullName: authUser.fullName || "",
  }

  await LogoutInteractor(redisClient, tokenUser);
  return res.status(204).json();
});

app.post("/api/v1/refreshToken", passport.authenticate(["jwt", "anonymous"], { session: false }), async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  const response = await RefreshTokenInteractor(prisma, refreshToken, configs);
  return res.status(200).json(response);
});

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

