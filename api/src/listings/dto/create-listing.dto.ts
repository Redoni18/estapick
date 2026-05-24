import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateListingDto {
  @ApiProperty({ description: 'Short, human-readable title for the listing.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Long-form property description.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({
    description: 'Asking price in the listing currency.',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'City the listing is located in.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  city: string;

  @ApiProperty({ description: 'Number of bedrooms.', minimum: 0 })
  @IsInt()
  @Min(0)
  @Max(50)
  bedrooms: number;

  @ApiProperty({ description: 'Number of bathrooms.', minimum: 0 })
  @IsInt()
  @Min(0)
  @Max(50)
  bathrooms: number;

  @ApiProperty({ description: 'Floor area in m².', minimum: 0 })
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ description: 'Latitude (WGS84).', minimum: -90, maximum: 90 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'Longitude (WGS84).',
    minimum: -180,
    maximum: 180,
  })
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'Publicly reachable image URLs (at least one).',
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({ require_protocol: true }, { each: true })
  images: string[];
}
