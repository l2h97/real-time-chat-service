import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  message: string;
  constructor(message: string) {
    super('Conflict', HttpStatus.CONFLICT);
    this.message = message;
  }

  getResponse(): string | object {
    return this.message;
  }
}
