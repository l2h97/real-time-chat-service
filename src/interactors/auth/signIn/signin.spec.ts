import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { configEnvironments } from "src/configs/configEnvironments";
import { idGenerator } from "src/pkgs/idGenerator";
import { passwordHasher } from "src/pkgs/passwordHasher";
import { PrismaService } from "src/services/prismaService/prisma.service";
import { setupTest } from "src/setupTest/setupTest";
import request from "supertest";
import { AuthModule } from "../auth.module";

describe("POST /auth/signin", () => {
  const url = "http://localhost:3002/api/v1";
  let app: INestApplication;
  let prismaService: PrismaService;
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

    app = await setupTest(module);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    await prismaService.image.deleteMany();
  });

  afterEach(async () => {
    await prismaService.user.deleteMany();
    await prismaService.image.deleteMany();
  });

  afterAll(async () => {
    // TODO ...
    // await prismaService.$queryRaw`DROP SCHEMA public CASCADE;`;
    // await prismaService.$disconnect();

    await app.close();
    await module.close();
  });

  it("Throw exception when not found user's email", async () => {
    const response = await request(url).post("/auth/signin").send({
      email: "lhhoang98197@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      status: "NOT_FOUND",
      timestamp: expect.any(String),
      path: "/api/v1/auth/signin",
      message: "User is not found",
    });
  });

  it("Throw exception when email is empty", async () => {
    const response = await request(url).post("/auth/signin").send({
      email: "",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      status: "BAD_REQUEST",
      timestamp: expect.any(String),
      path: "/api/v1/auth/signin",
      message: "email must be an email",
    });
  });

  it("Should not response Authorization and refresh_token in response header when password incorrect", async () => {
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

    const response = await request(url).post("/auth/signin").send({
      email: "lhhoang98197@gmail.com",
      password: "1234567",
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: id.toString(),
      email: "lhhoang98197@gmail.com",
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

  it("Should response Authorization and refresh_token when sign-in success", async () => {
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

    const response = await request(url).post("/auth/signin").send({
      email: "lhhoang98197@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: id.toString(),
      email: "lhhoang98197@gmail.com",
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

    expect(response.headers).toMatchObject({
      authorization: expect.any(String),
      refresh_token: expect.any(String),
    });
  });
});
