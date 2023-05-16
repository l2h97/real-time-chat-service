import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInPayloadDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
