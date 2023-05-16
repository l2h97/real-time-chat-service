import { ImageDto } from "src/dtos/imageDto";
import { UserDto } from "src/dtos/userDto";

export type UserResponseDto = UserDto & {
  profileImage: ImageDto;
  coverImage: ImageDto;
};
