import { ApiProperty } from '@nestjs/swagger';
import type { CityListingPreview } from './city-listing-preview.type';

export class CityListingPreviewEntity implements CityListingPreview {
  @ApiProperty()
  city: string;

  @ApiProperty()
  count: number;

  @ApiProperty({
    type: [String],
    description: 'Up to three sample image URLs.',
  })
  previewImages: string[];

  @ApiProperty()
  minPrice: number;

  @ApiProperty()
  maxPrice: number;
}
