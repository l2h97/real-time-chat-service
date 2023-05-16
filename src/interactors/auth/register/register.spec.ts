import request from "supertest";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { configEnvironments } from "src/configs/configEnvironments";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { setupTest } from "src/setupTest/setupTest";
import { AuthModule } from "../auth.module";
import { passwordHasher } from "src/pkgs/passwordHasher";
import { idGenerator } from "src/pkgs/idGenerator";
import * as idGeneratorModule from "src/pkgs/idGenerator";
import { RegisterService } from "./register.service";
import { UserCreateTokenService } from "../common/userCreateToken.service";

describe("POST /auth/register", () => {
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

  it("Throw exception when not provide info", async () => {
    const response = await request(url).post("/auth/register").send({});

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      status: "BAD_REQUEST",
      timestamp: expect.any(String),
      path: "/api/v1/auth/register",
      message: "email should not be empty",
    });
  });

  it("Throw exception when email not valid", async () => {
    const response = await request(url).post("/auth/register").send({
      email: "lhhoang98197",
      password: "123456",
      firstName: "Hoang",
      lastName: "Test",
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      status: "BAD_REQUEST",
      timestamp: expect.any(String),
      path: "/api/v1/auth/register",
      message: "email must be an email",
    });
  });

  it("Throw exception when email shorter than 50 characters", async () => {
    const response = await request(url).post("/auth/register").send({
      email:
        "lhhoang98197sssssssssssssssssssssssssssssssssssssssssssssssssss@gmail.com",
      password: "123456",
      firstName: "Hoang",
      lastName: "Test",
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      status: "BAD_REQUEST",
      timestamp: expect.any(String),
      path: "/api/v1/auth/register",
      message: "email must be shorter than or equal to 50 characters",
    });
  });

  it("Throw exception when password longer than 6 characters", async () => {
    const response = await request(url).post("/auth/register").send({
      email: "lhhoang98197@gmail.com",
      password: "12345",
      firstName: "Hoang",
      lastName: "Test",
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      status: "BAD_REQUEST",
      timestamp: expect.any(String),
      path: "/api/v1/auth/register",
      message: "password must be longer than or equal to 6 characters",
    });
  });

  it("Should response user info without token when email is exists", async () => {
    const email = "lhhoang98197@gmail.com";
    const password = "123456";
    const salfRounds = configEnvironments().saltRounds;
    const { salt, passwordHashed } = await passwordHasher(
      password,
      email,
      salfRounds,
    );
    const id = await idGenerator();

    const profileUrl =
      "https://avatars.abstractapi.com/v1?api_key=0bc8aec6d59f4ebfac48ad24c7a38d0e&name=profileHoangTest";
    const profileUrlId = await idGenerator();
    const coverUrl =
      "https://avatars.abstractapi.com/v1?api_key=0bc8aec6d59f4ebfac48ad24c7a38d0e&name=profileHoangTest";
    const coverUrlId = await idGenerator();

    await prismaService.user.create({
      data: {
        id,
        email,
        userName: "lhhoang98197@gmail.com",
        firstName: "Hoang",
        lastName: "test",
        fullName: "HoangTest",
        salt,
        hashPassword: passwordHashed,
        profileImage: {
          create: {
            id: profileUrlId,
            url: profileUrl,
          },
        },
        coverImage: {
          create: {
            id: coverUrlId,
            url: coverUrl,
          },
        },
      },
    });
    const user = await prismaService.user.findUnique({
      where: {
        id,
      },
    });
    expect(user?.id).toBe(id);

    const response = await request(url).post("/auth/register").send({
      email: "lhhoang98197@gmail.com",
      password: "123456",
      firstName: "Hoang",
      lastName: "Test",
    });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({
      id: id.toString(),
      email,
      userName: "lhhoang98197@gmail.com",
      firstName: "Hoang",
      lastName: "test",
      fullName: "HoangTest",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      profileImage: {
        id: profileUrlId.toString(),
        code: "",
        url: profileUrl,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      coverImage: {
        id: coverUrlId.toString(),
        code: "",
        url: coverUrl,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
    expect(response.headers["authorization"]).toBeUndefined();
    expect(response.headers["refresh_token"]).toBeUndefined();
  });

  it("Throw exception when userName generated is exists", async () => {
    const id = BigInt("9797591659866160");
    const mockId = jest
      .spyOn(idGeneratorModule, "idGenerator")
      .mockReturnValue(Promise.resolve(id));
    const email = "lhhoang98197@gmail.com";
    const password = "123456";
    const salfRounds = configEnvironments().saltRounds;
    const { salt, passwordHashed } = await passwordHasher(
      password,
      email,
      salfRounds,
    );

    const profileUrl =
      "https://avatars.abstractapi.com/v1?api_key=0bc8aec6d59f4ebfac48ad24c7a38d0e&name=profileHoangTest";
    const profileUrlId = BigInt("9797591659866161");
    const coverUrl =
      "https://avatars.abstractapi.com/v1?api_key=0bc8aec6d59f4ebfac48ad24c7a38d0e&name=profileHoangTest";
    const coverUrlId = BigInt("9797591659866162");

    await prismaService.user.create({
      data: {
        id,
        email,
        userName: `Hoang test ${id}`,
        firstName: "Hoang",
        lastName: "test",
        fullName: "Hoang test",
        salt,
        hashPassword: passwordHashed,
        profileImage: {
          create: {
            id: profileUrlId,
            url: profileUrl,
          },
        },
        coverImage: {
          create: {
            id: coverUrlId,
            url: coverUrl,
          },
        },
      },
    });
    const user = await prismaService.user.findUnique({
      where: {
        id,
      },
    });
    expect(user?.id).toBe(id);
    expect(user?.userName).toMatch(`Hoang test ${id}`);

    const response = await request(url).post("/auth/register").send({
      email: "lhhoang98197+1@gmail.com",
      password: "123456",
      firstName: "Hoang",
      lastName: "test",
    });
    const { status, body } = response;

    expect(status).toBe(400);
    expect(body).toMatchObject({
      status: "BAD_REQUEST",
      timestamp: expect.any(String),
      path: "/api/v1/auth/register",
      message: "Your userName is exists",
    });
    mockId.mockRestore();
  });

  it("Should response success when input has special characters", async () => {
    const userCreateTokenServiceData: { token: string; refreshToken: string } =
      {
        token: "hahahahahahaha",
        refreshToken: "huhuhuhuhuhuhu",
      };
    jest
      .spyOn(userCreateTokenService, "execute")
      .mockImplementation(() => Promise.resolve(userCreateTokenServiceData));
    const ImageUrl = "localhost:80/images/HoangleTest";
    jest
      .spyOn(registerService, "createImageUrl")
      .mockImplementation(() => ImageUrl);

    const response = await request(url).post("/auth/register").send({
      email: "lhhoang98197@gmail.com",
      password: "123456",
      firstName: " Hoàng_Lê",
      lastName: " Test",
    });
    const { status, body, headers } = response;

    expect(status).toBe(HttpStatus.OK);
    expect(body).toMatchObject({
      id: expect.any(String),
      email: "lhhoang98197@gmail.com",
      userName: expect.stringMatching(/Hoang_Le Test \d+/g),
      firstName: "Hoang_Le",
      lastName: "Test",
      fullName: "Hoang_Le Test",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      profileImage: {
        id: expect.any(String),
        code: "",
        url: ImageUrl,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      coverImage: {
        id: expect.any(String),
        code: "",
        url: ImageUrl,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
    expect(headers).toMatchObject({
      authorization: userCreateTokenServiceData.token,
      refresh_token: userCreateTokenServiceData.refreshToken,
    });
  });
});
