import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginPayload {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email = "";

  @Matches(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^\s])[A-Za-z\d~!@#$%^\s]{8,16}$/g,
    {
      message:
        "Password must have a combination of English letters, numbers, and special characters, between 8 and 16 characters in length.",
    },
  )
  @IsString()
  @IsNotEmpty()
  password = "";
}
