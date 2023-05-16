import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Configs } from "./configs/configs";
import { BadRequestException } from "./exceptions/badRequest.exception";
import { ValidationError } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle("RealTimeChatService")
    .setDescription("RealTimeChatService API document")
    .setVersion("1.0")
    .addTag("RealTimeChatServiceAPIs")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "access-token",
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  const configService = app.get(ConfigService<Configs, true>);
  await app.listen(configService.get("port"));
}
bootstrap();
