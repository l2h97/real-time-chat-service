import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationError, useContainer } from "class-validator";
import { BadRequestException } from "./exceptions/badRequest.exception";
import { ConfigurationService } from "./services/configurationService/configuration.service";
import { HttpExceptionFilter } from "./exceptions/httpException.filter";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    exposedHeaders: ["Authorization", "refresh_token"],
    methods: "GET, PUT, POST, DELETE, UPDATE, OPTIONS, PATCH",
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
  app.useGlobalFilters(new HttpExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Paction")
    .setDescription("The Paction API description")
    .setVersion("0.1")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const configurationService = app.get(ConfigurationService);

  const port = configurationService.port;
  await app.listen(port);
}
bootstrap();
