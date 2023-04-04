import { ImageDto } from "src/dtos/modelDtos/imageDto";
import { UserDto } from "src/dtos/modelDtos/userDto";

export type UserResponseDto = UserDto & {
  profileImage: ImageDto;
  coverImage: ImageDto;
};
