import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Rate limiting (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // ConfigModule reads process.env when the module is instantiated,
    // so overrides applied here propagate to ThrottlerModule's factory.
    process.env.THROTTLE_ENABLED = 'true';
    process.env.THROTTLE_READ_TTL = '60';
    process.env.THROTTLE_READ_LIMIT = '2';
    process.env.THROTTLE_WRITE_TTL = '60';
    process.env.THROTTLE_WRITE_LIMIT = '1';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ bufferLogs: true });
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  it('returns 429 once the read bucket is exhausted on GET /listings', async () => {
    const first = await http().get('/api/v1/listings');
    const second = await http().get('/api/v1/listings');
    const third = await http().get('/api/v1/listings');

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
  });

  it('does not throttle GET /api/health', async () => {
    const responses = await Promise.all(
      Array.from({ length: 5 }, () => http().get('/api/health')),
    );

    expect(responses.every((r) => r.status === 200)).toBe(true);
  });
});
