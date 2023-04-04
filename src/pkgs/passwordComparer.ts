import { compare } from "bcrypt";

export const passwordComparer = async (
  email: string,
  password: string,
  hashPassword: string
): Promise<boolean> => {
  const plainPassword = `${email}${password}`;

  return compare(plainPassword, hashPassword);
};
