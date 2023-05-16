import { ImageDto } from "src/dtos/imageDto";
import { UserDto } from "src/dtos/userDto";

export type UserAuthResDto = {
  token: string;
  refreshToken: string;
  user: UserDto & {
    profileImage: ImageDto | Record<string, unknown>;
    coverImage: ImageDto | Record<string, unknown>;
  };
};
