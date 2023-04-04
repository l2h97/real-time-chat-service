import { ImageDto } from "src/dtos/modelDtos/imageDto";
import { UserDto } from "src/dtos/modelDtos/userDto";

export type UserAuthResDto = {
  token: string;
  refreshToken: string | null;
  user: UserDto & {
    profileImage: ImageDto | Record<string, unknown>;
    coverImage: ImageDto | Record<string, unknown>;
  };
};
