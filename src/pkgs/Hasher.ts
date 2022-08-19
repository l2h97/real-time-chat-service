import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

// export class Hasher {
//   constructor() {}

//   hash(email: string, password: string): { salt: string, hashPassword: string} {
//     const plainPassword = `${email}${password}`;
//     const salt = bcrypt.genSaltSync(SALT_ROUNDS);
//     const hashPassword = bcrypt.hashSync(plainPassword, salt);

//     return {
//       salt,
//       hashPassword,
//     }
//   }
// }

export const Hasher = function(email: string, password: string): { salt: string, hashPassword: string } {
  const plainPassword = `${email}${password}`;
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashPassword = bcrypt.hashSync(plainPassword, salt);

  return {
    salt,
    hashPassword,
  }
}