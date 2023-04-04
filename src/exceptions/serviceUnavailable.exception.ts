import { HttpException, HttpStatus } from "@nestjs/common";

export class ServiceUnavailableException extends HttpException {
  message: string;
  constructor(message: string) {
    super("ServiceUnavailable", HttpStatus.SERVICE_UNAVAILABLE);
    this.message = message;
  }

  getResponse(): string | object {
    return this.message;
  }
}
