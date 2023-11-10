import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./exceptions/httpException.filter";
import { useContainer } from "class-validator";
import { ConfigurationService } from "./configs/configuration.service";
import { LoggerService } from "./services/loggerService/logger.service";
import { correlationMiddleware } from "./middlewares/correlation.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerService = await app.resolve(LoggerService);
  app.use(correlationMiddleware(loggerService));

  app.enableCors({
    origin: "*",
    exposedHeaders: ["Authorization", "refresh_token", "correlationId"],
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
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Real time chat apis")
    .setDescription("Real time chat API description")
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
