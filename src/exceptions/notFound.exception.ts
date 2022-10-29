import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  message: string;
  constructor(message: string) {
    super('NotFound', HttpStatus.NOT_FOUND);
    this.message = message;
  }

  getResponse(): string | object {
    return this.message;
  }
}
