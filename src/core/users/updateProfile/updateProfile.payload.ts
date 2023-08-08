import { Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from "class-validator";

export class MediaPayLoad {
  @MaxLength(300)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code?: string;

  @MaxLength(500)
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  url = "";
}

export class UpdateProfilePayload {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @MaxLength(50)
  @IsString()
  @IsOptional()
  firstName?: string;

  @MaxLength(50)
  @IsString()
  @IsOptional()
  lastName?: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @IsObject()
  @IsOptional()
  @Type(() => MediaPayLoad)
  photo?: MediaPayLoad;

  @ValidateNested()
  @IsNotEmptyObject()
  @IsObject()
  @IsOptional()
  @Type(() => MediaPayLoad)
  cover?: MediaPayLoad;
}
