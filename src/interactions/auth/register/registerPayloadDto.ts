import { Type } from 'class-transformer';
import {
  IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested,
} from 'class-validator';
import { ImageUploadPayloadDto } from './imageUploadPayloadDto';

export class RegisterPayloadDto {
  @IsNotEmpty({
    message: 'Email should not empty',
  })
  @IsEmail()
    email: string;

  @IsNotEmpty({
    message: 'Password should not empty',
  })
  @IsString({
    message: 'Password must be string',
  })
    password: string;

  @IsNotEmpty({
    message: 'First name should not empty',
  })
  @IsString({
    message: 'First name must be string',
  })
    firstName: string;

  @IsNotEmpty({
    message: 'Last name should not empty',
  })
  @IsString({
    message: 'Last name must be string',
  })
    lastName: string;

  @IsObject({
    message: 'Profile Image should be object',
  })
  @ValidateNested()
  @Type(() => ImageUploadPayloadDto)
  @IsOptional()
    profileImage?: ImageUploadPayloadDto;

  @IsObject({
    message: 'Cover Image should be object',
  })
  @ValidateNested()
  @Type(() => ImageUploadPayloadDto)
  @IsOptional()
    coverImage?: ImageUploadPayloadDto;
}
