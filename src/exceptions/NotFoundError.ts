import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(404, message);
    this.message = message;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  getErrorMessage() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    }
  }
}