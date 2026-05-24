import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  AppConfig,
  configuration,
  configValidationSchema,
} from './config/configuration';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { ListingsModule } from './listings/listings.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
      validationOptions: { abortEarly: true, allowUnknown: true },
      cache: true,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        throttlers: [
          {
            name: 'read',
            ttl: config.get('throttleReadTtl', { infer: true }) * 1000,
            limit: config.get('throttleReadLimit', { infer: true }),
          },
          {
            name: 'write',
            ttl: config.get('throttleWriteTtl', { infer: true }) * 1000,
            limit: config.get('throttleWriteLimit', { infer: true }),
          },
        ],
        skipIf: () => !config.get('throttleEnabled', { infer: true }),
      }),
    }),
    PrismaModule,
    ListingsModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
