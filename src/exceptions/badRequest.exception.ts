import { HttpException, HttpStatus } from "@nestjs/common";

export class BadRequestException extends HttpException {
  message: string;
  constructor(message: string) {
    super("BadRequest", HttpStatus.BAD_REQUEST);
    this.message = message;
  }

  getResponse(): string | object {
    return this.message;
  }
}
