export class BaseError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  getErrorMessage() {
    return {
      statusCode: this.statusCode,
      message: this.message
    }
  }
}