import { ConflictException } from "../conflict.exception";

export class UploadMediaException extends ConflictException {
  constructor() {
    super("An error occurred when upload to our server");
  }
}
