// TODO
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ImageUploadPayloadDto {
  @IsNotEmpty({
    message: "Image code should not empty",
  })
  @IsString({
    message: "Image code must be string",
  })
  @IsOptional()
  code?: string;

  @IsNotEmpty({
    message: "Image url should not empty",
  })
  @IsString({
    message: "Image url must be string",
  })
  url: string;
}
