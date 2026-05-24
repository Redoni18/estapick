import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfig } from './config/configuration';

const API_PREFIX = 'api';
const SWAGGER_PATH = `${API_PREFIX}/docs`;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');

  const config = app.get(ConfigService<AppConfig, true>);

  app.enableCors();
  app.setGlobalPrefix(API_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  const swaggerEnabled = config.get('swaggerEnabled', { infer: true });
  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Estapick Listings API')
      .setDescription(
        'REST API powering the Estapick real-estate marketplace take-home.',
      )
      .setVersion('1.0')
      .addTag('listings')
      .addTag('health')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(SWAGGER_PATH, app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    logger.log(`Swagger UI available at /${SWAGGER_PATH}`);
  }

  const port = config.get('port', { infer: true });
  await app.listen(port);
  logger.log(`API listening on http://localhost:${port}/${API_PREFIX}`);
}

void bootstrap();
