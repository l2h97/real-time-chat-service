import { Prisma } from "@prisma/client";

const userQuery = Prisma.validator<Prisma.UserArgs>()({
  include: {
    profileImage: true,
    coverImage: true,
  },
});

export type UserQueryDto = Prisma.UserGetPayload<typeof userQuery>;
