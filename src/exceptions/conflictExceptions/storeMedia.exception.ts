import { ConflictException } from "../conflict.exception";

export class StoreMediaException extends ConflictException {
  constructor() {
    super("An error occurred when we store media resource");
  }
}
