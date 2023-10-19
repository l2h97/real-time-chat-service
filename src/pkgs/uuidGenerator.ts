import { v1 } from "uuid";

export const uuidGenerator = (): string => {
  return v1();
};
