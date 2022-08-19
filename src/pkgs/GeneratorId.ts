import { customAlphabet } from "nanoid";

// export class GeneratorId {
//   constructor() {}

//   getId(): bigint {
//     const uuid = customAlphabet("0123456789");
//     const id = uuid();
//     return BigInt(id);
//   }
// }

export const GeneratorId = function(): bigint {
  const uuid = customAlphabet("0123456789", 19);
  const id = uuid();
  return BigInt(id);
}