import { NextFunction, Request, Response } from "express";
import { BaseError } from "../exceptions/BaseError";

export const ErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({ statusCode: error.statusCode, message: error.message });
  }

  return res.status(500).json({ statusCode: 500, message: "Unknow error" });
}