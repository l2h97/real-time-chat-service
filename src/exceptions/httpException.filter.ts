import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { isString } from "class-validator";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();
    const correlationId = request.headers["correlationId"];

    if (!isString(message) && "message" in message) {
      return response.status(status).json({
        correlationId,
        statusCode: status,
        status: HttpStatus[status],
        timestamp: new Date().toISOString(),
        path: request.url,
        message: Array.isArray(message.message)
          ? message.message[0]
          : message.message,
      });
    }

    return response.status(status).json({
      correlationId,
      statusCode: status,
      status: HttpStatus[status],
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
