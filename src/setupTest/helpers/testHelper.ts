import { execSync } from "child_process";
import { join } from "path";

export const testHelper = async () => {
  const url =
    process.env.DATABASE_TEST_URL ||
    "postgresql://admin:Password@localhost:5432/real-time-db-test?schema=public";
  const command = join(
    __dirname,
    "..",
    "..",
    "..",
    "node_modules",
    ".bin",
    "prisma",
  );
  process.env.DATABASE_URL = url;
  execSync(`${command} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: url,
    },
  });
};
