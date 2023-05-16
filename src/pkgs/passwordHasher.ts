import { genSalt, hash } from "bcrypt";

export const passwordHasher = async (
  password: string,
  email: string,
  salfRounds: number,
): Promise<{ salt: string; passwordHashed: string }> => {
  const plainPassword = `${email}${password}`;
  const salt = await genSalt(salfRounds);
  const passwordHashed = await hash(plainPassword, salt);

  return {
    salt,
    passwordHashed,
  };
};
