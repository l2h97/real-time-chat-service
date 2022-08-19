import bcrypt from "bcrypt";

export const Comparer = function (email: string, password: string, hashPassword: string) {
  const plainPassword = `${email}${password}`;
  return bcrypt.compareSync(plainPassword, hashPassword);
}