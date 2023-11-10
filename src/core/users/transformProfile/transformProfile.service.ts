import { Injectable } from "@nestjs/common";
import { Media, Prisma } from "@prisma/client";

export const profileQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    profileImage: true,
    coverImage: true,
  },
});

export type ProfileQuery = Prisma.UserGetPayload<typeof profileQuery>;

export type MediaResponse = {
  id: number;
  code: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

export type MyProfileResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profile: MediaResponse;
  cover: MediaResponse | null;
  createdAt: string;
  updatedAt: string;
};

export type ProfileResponse = Omit<MyProfileResponse, "email">;

@Injectable()
export class TransformMediaResponse {
  transform(media: Media): MediaResponse {
    return {
      id: media.id,
      code: media.code || "",
      url: media.url,
      createdAt: media.createdAt.toISOString(),
      updatedAt: media.updatedAt.toISOString(),
    };
  }
}

@Injectable()
export class TransformMyProfileResponse {
  constructor(private transformMediaResponse: TransformMediaResponse) {}

  transform(myProfile: ProfileQuery): MyProfileResponse {
    return {
      id: myProfile.id,
      email: myProfile.email,
      firstName: myProfile.firstName,
      lastName: myProfile.lastName,
      fullName: myProfile.fullName,
      profile: this.transformMediaResponse.transform(myProfile.profileImage),
      cover: myProfile.coverImage
        ? this.transformMediaResponse.transform(myProfile.coverImage)
        : null,
      createdAt: myProfile.createdAt.toISOString(),
      updatedAt: myProfile.updatedAt.toISOString(),
    };
  }
}

@Injectable()
export class TransformProfileResponse {
  constructor(private transformMediaResponse: TransformMediaResponse) {}

  transform(profile: ProfileQuery): ProfileResponse {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      fullName: profile.fullName,
      profile: this.transformMediaResponse.transform(profile.profileImage),
      cover: profile.coverImage
        ? this.transformMediaResponse.transform(profile.coverImage)
        : null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
