import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import type {
  ListingEntity,
  PaginatedListingsResponse,
} from '../src/listings/entities/listing.entity';

const validImage = 'https://cdn.example.com/p.jpg';

const asPage = (body: unknown): PaginatedListingsResponse =>
  body as PaginatedListingsResponse;
const asListing = (body: unknown): ListingEntity => body as ListingEntity;
const asError = (body: unknown): { message: string | string[] } =>
  body as { message: string | string[] };
const asHealth = (
  body: unknown,
): {
  status: string;
  info: Record<string, unknown>;
} =>
  body as {
    status: string;
    info: Record<string, unknown>;
  };

interface SeedListingInput {
  title: string;
  description?: string;
  price: number;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  images?: string[];
}

const fixtures: SeedListingInput[] = [
  {
    title: 'Paris Studio',
    price: 320_000,
    city: 'Paris',
    bedrooms: 1,
    bathrooms: 1,
    area: 30,
    latitude: 48.86,
    longitude: 2.34,
  },
  {
    title: 'Paris Family Flat',
    price: 950_000,
    city: 'Paris',
    bedrooms: 3,
    bathrooms: 2,
    area: 100,
    latitude: 48.87,
    longitude: 2.35,
  },
  {
    title: 'Tokyo Penthouse',
    price: 1_800_000,
    city: 'Tokyo',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    latitude: 35.66,
    longitude: 139.7,
  },
];

async function seed(prisma: PrismaService): Promise<void> {
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();

  for (const fixture of fixtures) {
    await prisma.listing.create({
      data: {
        title: fixture.title,
        description: fixture.description ?? `${fixture.title} description`,
        price: fixture.price,
        city: fixture.city,
        bedrooms: fixture.bedrooms,
        bathrooms: fixture.bathrooms,
        area: fixture.area,
        latitude: fixture.latitude,
        longitude: fixture.longitude,
        images: {
          create: (fixture.images ?? [validImage]).map((url) => ({ url })),
        },
      },
    });
  }
}

describe('Listings (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
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

    prisma = app.get(PrismaService);
    await seed(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  describe('GET /api/v1/listings', () => {
    it('returns the { data, meta } envelope with all seed rows', async () => {
      const res = await http().get('/api/v1/listings');
      const page = asPage(res.body);

      expect(res.status).toBe(200);
      expect(page.data).toHaveLength(fixtures.length);
      expect(page.meta).toEqual({
        total: fixtures.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(page.data[0].images).toEqual([validImage]);
    });

    it('filters by city', async () => {
      const res = await http().get('/api/v1/listings').query({ city: 'Paris' });
      const page = asPage(res.body);

      expect(res.status).toBe(200);
      expect(page.data.every((l) => l.city === 'Paris')).toBe(true);
      expect(page.meta.total).toBe(2);
    });

    it('filters by city case-insensitively', async () => {
      const res = await http().get('/api/v1/listings').query({ city: 'paris' });
      const page = asPage(res.body);

      expect(res.status).toBe(200);
      expect(page.data.every((l) => l.city === 'Paris')).toBe(true);
      expect(page.meta.total).toBe(2);
    });

    it('respects minPrice/maxPrice/bedrooms filters', async () => {
      const res = await http()
        .get('/api/v1/listings')
        .query({ minPrice: 500_000, maxPrice: 2_000_000, bedrooms: 3 });
      const page = asPage(res.body);

      expect(res.status).toBe(200);
      expect(
        page.data.every(
          (l) => l.price >= 500_000 && l.price <= 2_000_000 && l.bedrooms === 3,
        ),
      ).toBe(true);
      expect(page.meta.total).toBe(2);
    });

    it('limits results to the bbox', async () => {
      const res = await http()
        .get('/api/v1/listings')
        .query({ bbox: '48.80,2.30,48.90,2.40' });
      const page = asPage(res.body);

      expect(res.status).toBe(200);
      expect(page.data.every((l) => l.city === 'Paris')).toBe(true);
    });

    it('rejects malformed bbox with 400', async () => {
      const res = await http()
        .get('/api/v1/listings')
        .query({ bbox: 'not-a-bbox' });

      expect(res.status).toBe(400);
    });

    it('paginates with page + limit', async () => {
      const res = await http()
        .get('/api/v1/listings')
        .query({ page: 2, limit: 2 });
      const page = asPage(res.body);

      expect(res.status).toBe(200);
      expect(page.data).toHaveLength(fixtures.length - 2);
      expect(page.meta).toEqual({
        total: fixtures.length,
        page: 2,
        limit: 2,
        totalPages: Math.ceil(fixtures.length / 2),
      });
    });

    it('rejects unknown query parameters', async () => {
      const res = await http().get('/api/v1/listings').query({ foo: 'bar' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/listings/:id', () => {
    it('returns 200 + the listing when it exists', async () => {
      const existing = await prisma.listing.findFirstOrThrow();

      const res = await http().get(`/api/v1/listings/${existing.id}`);
      const listing = asListing(res.body);

      expect(res.status).toBe(200);
      expect(listing.id).toBe(existing.id);
      expect(listing.images).toEqual([validImage]);
    });

    it('returns 404 for a well-formed but unknown UUID', async () => {
      const res = await http().get(
        '/api/v1/listings/00000000-0000-4000-8000-000000000000',
      );

      expect(res.status).toBe(404);
    });

    it('returns 400 for a malformed id', async () => {
      const res = await http().get('/api/v1/listings/not-a-uuid');

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/listings', () => {
    const validBody = {
      title: 'Brand New Loft',
      description: 'Stunning loft in the city center.',
      price: 875_000,
      city: 'Paris',
      bedrooms: 2,
      bathrooms: 1,
      area: 85,
      latitude: 48.85,
      longitude: 2.34,
      images: ['https://cdn.example.com/new.jpg'],
    };

    it('creates a listing with valid input and returns 201', async () => {
      const res = await http().post('/api/v1/listings').send(validBody);
      const listing = asListing(res.body);

      expect(res.status).toBe(201);
      expect(listing.id).toEqual(expect.any(String));
      expect(listing.title).toBe(validBody.title);
      expect(listing.images).toEqual(validBody.images);
    });

    it('rejects a payload with missing required fields (400)', async () => {
      const res = await http()
        .post('/api/v1/listings')
        .send({ title: 'Only title' });

      expect(res.status).toBe(400);
      expect(Array.isArray(asError(res.body).message)).toBe(true);
    });

    it('rejects negative price (400)', async () => {
      const res = await http()
        .post('/api/v1/listings')
        .send({ ...validBody, price: -10 });

      expect(res.status).toBe(400);
    });

    it('rejects non-URL image strings (400)', async () => {
      const res = await http()
        .post('/api/v1/listings')
        .send({ ...validBody, images: ['not-a-url'] });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/health', () => {
    it('returns 200 and an "ok" status', async () => {
      const res = await http().get('/api/health');
      const health = asHealth(res.body);

      expect(res.status).toBe(200);
      expect(health.status).toBe('ok');
      expect(health.info).toHaveProperty('database');
    });
  });
});
