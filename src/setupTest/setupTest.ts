import { ValidationPipe, VersioningType } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

export const setupTest = async (testModule: TestingModule) => {
  const app = testModule.createNestApplication();
  app.enableCors({
    origin: "*",
    exposedHeaders: ["Authorization", "refresh_token"],
    methods: "GET, PUT, POST, DELETE, UPDATE, OPTIONS",
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["v1"],
    prefix: "",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  await app.listen(3002);
  await app.init();

  return app;
};
