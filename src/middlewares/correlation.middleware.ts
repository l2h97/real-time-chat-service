import { NextFunction, Request, Response } from "express";
import { UuidGenerator } from "src/pkgs/uuidGenerator";
import { LoggerService } from "src/services/loggerService/logger.service";

export const correlationMiddleware = (logger: LoggerService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers["correlationId"]) {
      const correlationId = UuidGenerator();
      req.headers["correlationId"] = correlationId;
      res.setHeader("correlationId", correlationId);
      logger.setCorrelationId = correlationId;
    }

    next();
  };
};
