import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  message: string;
  constructor(message: string) {
    super('Unauthorized', HttpStatus.UNAUTHORIZED);
    this.message = message;
  }

  getResponse(): string | object {
    return this.message;
  }
}
