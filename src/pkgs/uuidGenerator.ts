import { v1 } from "uuid";

export const UuidGenerator = (): string => {
  return v1();
};
