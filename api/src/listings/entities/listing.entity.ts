import { ApiProperty } from '@nestjs/swagger';

export class ListingEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  city: string;

  @ApiProperty()
  bedrooms: number;

  @ApiProperty()
  bathrooms: number;

  @ApiProperty({ description: 'Floor area in m².' })
  area: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty({ type: [String], description: 'Image URLs in upload order.' })
  images: string[];

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export class PaginationMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginatedListingsResponse {
  @ApiProperty({ type: [ListingEntity] })
  data: ListingEntity[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
