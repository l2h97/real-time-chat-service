import { v5 } from "uuid";

export const generateImageCode = (code: string) => {
  const delimiter = "\x00";
  const currentTime = new Date().toISOString();
  return v5(`${code}${delimiter}${currentTime}`, v5.URL);
};
