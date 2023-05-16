import { ValidationPipe, VersioningType } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { ValidationError } from "class-validator";
import { BadRequestException } from "src/exceptions/badRequest.exception";
import { HttpExceptionFilter } from "src/exceptions/httpException.filter";

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
      exceptionFactory: (validationError: ValidationError[] = []) => {
        if (validationError[0].constraints) {
          const message = Object.values(validationError[0].constraints)[0];
          return new BadRequestException(message);
        }
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3002);
  await app.init();

  return app;
};
