import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListListingsQueryDto } from './dto/list-listings-query.dto';
import {
  ListingEntity,
  PaginatedListingsResponse,
} from './entities/listing.entity';
import type { CityListingPreview } from './entities/city-listing-preview.type';

type ListingWithImages = Prisma.ListingGetPayload<{
  include: { images: true };
}>;

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateListingDto): Promise<ListingEntity> {
    const { images, ...data } = dto;

    const listing = await this.prisma.listing.create({
      data: {
        ...data,
        images: { create: images.map((url) => ({ url })) },
      },
      include: { images: true },
    });

    return this.toEntity(listing);
  }

  async findAll(
    query: ListListingsQueryDto,
  ): Promise<PaginatedListingsResponse> {
    const { page, limit } = query;
    const where = this.buildWhere(query);
    const skip = (page - 1) * limit;

    const [total, listings] = await this.prisma.$transaction([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where,
        include: { images: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: listings.map((l) => this.toEntity(l)),
      meta: {
        total,
        page,
        limit,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
      },
    };
  }

  async getCitySummaries(): Promise<CityListingPreview[]> {
    const listings = await this.prisma.listing.findMany({
      include: { images: { take: 1, orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    const summaries = new Map<string, CityListingPreview>();

    for (const listing of listings) {
      const imageUrl = listing.images[0]?.url;
      const existing = summaries.get(listing.city);

      if (!existing) {
        summaries.set(listing.city, {
          city: listing.city,
          count: 1,
          previewImages: imageUrl ? [imageUrl] : [],
          minPrice: listing.price,
          maxPrice: listing.price,
        });
        continue;
      }

      existing.count += 1;
      existing.minPrice = Math.min(existing.minPrice, listing.price);
      existing.maxPrice = Math.max(existing.maxPrice, listing.price);
      if (imageUrl && existing.previewImages.length < 3) {
        existing.previewImages.push(imageUrl);
      }
    }

    return Array.from(summaries.values()).sort((a, b) =>
      a.city.localeCompare(b.city),
    );
  }

  async findOne(id: string): Promise<ListingEntity> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID "${id}" not found`);
    }

    return this.toEntity(listing);
  }

  private buildWhere(query: ListListingsQueryDto): Prisma.ListingWhereInput {
    const { city, minPrice, maxPrice, bedrooms, bbox } = query;
    const where: Prisma.ListingWhereInput = {};

    if (city) {
      where.city = { equals: city, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    if (bedrooms !== undefined) {
      where.bedrooms = bedrooms;
    }

    if (bbox) {
      const [minLat, minLng, maxLat, maxLng] = bbox;
      where.latitude = { gte: minLat, lte: maxLat };
      where.longitude = { gte: minLng, lte: maxLng };
    }

    return where;
  }

  private toEntity(listing: ListingWithImages): ListingEntity {
    const { images, ...rest } = listing;
    return { ...rest, images: images.map((img) => img.url) };
  }
}
