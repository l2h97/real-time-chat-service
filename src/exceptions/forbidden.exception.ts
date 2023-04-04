import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
  message: string;
  constructor(message: string) {
    super("Forbidden", HttpStatus.FORBIDDEN);
    this.message = message;
  }

  getResponse(): string | object {
    return this.message;
  }
}
