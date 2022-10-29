import {
  IsEmail, IsNotEmpty, IsString,
} from 'class-validator';

export class SignInPayloadDto {
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
}
