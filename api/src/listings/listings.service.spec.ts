import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ListingsService } from './listings.service';
import type { ListListingsQueryDto } from './dto/list-listings-query.dto';

type ListingRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  createdAt: Date;
  images: { id: string; url: string; listingId: string; createdAt: Date }[];
};

const buildRow = (overrides: Partial<ListingRow> = {}): ListingRow => ({
  id: 'listing-1',
  title: 'Mock Apartment',
  description: 'A mock apartment',
  price: 500_000,
  city: 'Paris',
  bedrooms: 2,
  bathrooms: 1,
  area: 50,
  latitude: 48.85,
  longitude: 2.35,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  images: [
    {
      id: 'img-1',
      url: 'https://example.com/img.jpg',
      listingId: 'listing-1',
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
  ],
  ...overrides,
});

const buildQuery = (
  overrides: Partial<ListListingsQueryDto> = {},
): ListListingsQueryDto => ({
  page: 1,
  limit: 10,
  ...overrides,
});

const firstCallArg = (mock: jest.Mock): { where: Record<string, unknown> } => {
  const calls = mock.mock.calls as unknown as [
    { where: Record<string, unknown> },
  ][];
  return calls[0][0];
};

describe('ListingsService', () => {
  let service: ListingsService;
  let prisma: {
    listing: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      listing: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ListingsService);
  });

  describe('findAll', () => {
    it('returns the mapped data + meta envelope', async () => {
      prisma.$transaction.mockResolvedValueOnce([1, [buildRow()]]);

      const result = await service.findAll(buildQuery({ city: 'Paris' }));

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].images).toEqual(['https://example.com/img.jpg']);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('filters by city case-insensitively', async () => {
      prisma.$transaction.mockResolvedValueOnce([0, []]);

      await service.findAll(buildQuery({ city: 'paris' }));

      const args = firstCallArg(prisma.listing.findMany);
      expect(args.where).toEqual({
        city: { equals: 'paris', mode: 'insensitive' },
      });
    });

    it('translates a parsed bbox tuple into lat/lng range filters', async () => {
      prisma.$transaction.mockResolvedValueOnce([0, []]);

      await service.findAll(buildQuery({ bbox: [48.8, 2.3, 48.9, 2.4] }));

      const args = firstCallArg(prisma.listing.findMany);
      expect(args.where).toEqual(
        expect.objectContaining({
          latitude: { gte: 48.8, lte: 48.9 },
          longitude: { gte: 2.3, lte: 2.4 },
        }),
      );
    });

    it('combines minPrice/maxPrice/bedrooms into a single where clause', async () => {
      prisma.$transaction.mockResolvedValueOnce([0, []]);

      await service.findAll(
        buildQuery({ minPrice: 100, maxPrice: 500, bedrooms: 2 }),
      );

      const args = firstCallArg(prisma.listing.findMany);
      expect(args.where).toEqual({
        price: { gte: 100, lte: 500 },
        bedrooms: 2,
      });
    });
  });

  describe('findOne', () => {
    it('returns the mapped listing when it exists', async () => {
      prisma.listing.findUnique.mockResolvedValueOnce(buildRow());

      const result = await service.findOne('listing-1');

      expect(prisma.listing.findUnique).toHaveBeenCalledWith({
        where: { id: 'listing-1' },
        include: { images: true },
      });
      expect(result.id).toBe('listing-1');
      expect(result.images).toEqual(['https://example.com/img.jpg']);
    });

    it('throws NotFoundException when the listing is missing', async () => {
      prisma.listing.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('persists the listing with nested image rows and returns the mapped entity', async () => {
      const created = buildRow({
        id: 'new-id',
        title: 'Fresh Listing',
        images: [
          {
            id: 'img-new',
            url: 'https://cdn.example.com/a.jpg',
            listingId: 'new-id',
            createdAt: new Date('2026-01-02T00:00:00Z'),
          },
        ],
      });
      prisma.listing.create.mockResolvedValueOnce(created);

      const dto = {
        title: 'Fresh Listing',
        description: 'A brand new mock listing',
        price: 750_000,
        city: 'Tokyo',
        bedrooms: 3,
        bathrooms: 2,
        area: 90,
        latitude: 35.68,
        longitude: 139.7,
        images: ['https://cdn.example.com/a.jpg'],
      };

      const result = await service.create(dto);

      expect(prisma.listing.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          description: dto.description,
          price: dto.price,
          city: dto.city,
          bedrooms: dto.bedrooms,
          bathrooms: dto.bathrooms,
          area: dto.area,
          latitude: dto.latitude,
          longitude: dto.longitude,
          images: { create: [{ url: 'https://cdn.example.com/a.jpg' }] },
        },
        include: { images: true },
      });
      expect(result.id).toBe('new-id');
      expect(result.images).toEqual(['https://cdn.example.com/a.jpg']);
    });
  });
});
