import { ImageDto } from 'src/dtos/modelDtos/imageDto';
import { UserDto } from 'src/dtos/modelDtos/userDto';

export type UserAuthResDto = {
  token?: string;
  refreshToken?: string;
  user: UserDto & {
    profileImage?: ImageDto;
    coverImage?: ImageDto;
  }
}
