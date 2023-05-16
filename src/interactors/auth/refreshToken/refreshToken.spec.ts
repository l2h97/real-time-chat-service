import request from "supertest";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { configEnvironments } from "src/configs/configEnvironments";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { setupTest } from "src/setupTest/setupTest";
import { AuthModule } from "../auth.module";
import { UserCreateTokenService } from "../common/userCreateToken.service";
import { RegisterService } from "../register/register.service";

describe("POST /auth/refresh", () => {
  const url = "http://localhost:3002/api/v1";
  let app: INestApplication;
  let prismaService: PrismaService;
  let userCreateTokenService: UserCreateTokenService;
  let registerService: RegisterService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot({
          load: [configEnvironments],
          isGlobal: true,
        }),
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    userCreateTokenService = module.get<UserCreateTokenService>(
      UserCreateTokenService,
    );
    registerService = module.get<RegisterService>(RegisterService);

    app = await setupTest(module);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    await prismaService.image.deleteMany();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prismaService.user.deleteMany();
    await prismaService.image.deleteMany();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // TODO ...
    // await prismaService.$queryRaw`DROP SCHEMA public CASCADE;`;
    // await prismaService.$disconnect();

    await app.close();
    await module.close();
  });

  it("Should throw error when not have refresh token", async () => {
    const response = await request(url).post("/auth/refresh");

    const { status, body } = response;

    expect(status).toBe(HttpStatus.UNAUTHORIZED);
    expect(body).toMatchObject({
      status: "UNAUTHORIZED",
      timestamp: expect.any(String),
      path: "/api/v1/auth/refresh",
      message: "Invald token",
    });
  });
});
