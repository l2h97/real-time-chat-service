-- AlterTable
CREATE SEQUENCE friendlist_id_seq;
ALTER TABLE "FriendList" ALTER COLUMN "id" SET DEFAULT nextval('friendlist_id_seq');
ALTER SEQUENCE friendlist_id_seq OWNED BY "FriendList"."id";

-- AlterTable
CREATE SEQUENCE media_id_seq;
ALTER TABLE "Media" ALTER COLUMN "id" SET DEFAULT nextval('media_id_seq');
ALTER SEQUENCE media_id_seq OWNED BY "Media"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";
