import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { LoginPayload } from "../login/login.payload";

export class RegisterPayload extends LoginPayload {
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  firstName = "";

  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  lastName = "";
}
