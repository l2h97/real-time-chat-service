import { testHelper } from "src/setupTest/helpers/testHelper";

beforeAll(async () => {
  await testHelper();
});

import "./signIn/signin.spec";
import "./register/register.spec";