import { BadRequestException } from "../badRequest.exception";

export class ImageTypeException extends BadRequestException {
  constructor() {
    super("Image Uploaded must is valid format");
  }
}
