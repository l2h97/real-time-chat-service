import { customAlphabet } from 'nanoid/async';

export const idGenerator = async () => {
  const nanoid = customAlphabet('0123456789', 16);
  const id = await nanoid();
  return BigInt(id);
};
