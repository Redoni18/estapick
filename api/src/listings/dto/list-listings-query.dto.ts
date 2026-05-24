import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const BBOX_DELIMITER = ',';
const BBOX_LENGTH = 4;

export type BoundingBox = [
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
];

@ValidatorConstraint({ name: 'IsBoundingBox', async: false })
class IsBoundingBoxConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (!Array.isArray(value) || value.length !== BBOX_LENGTH) return false;
    if (!value.every((n) => typeof n === 'number' && Number.isFinite(n))) {
      return false;
    }
    const [minLat, minLng, maxLat, maxLng] = value as BoundingBox;
    if (minLat < -90 || maxLat > 90 || minLat > maxLat) return false;
    if (minLng < -180 || maxLng > 180 || minLng > maxLng) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be "minLat,minLng,maxLat,maxLng" with valid coordinate ranges`;
  }
}

function parseBbox({ value }: { value: unknown }): unknown {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || value.length === 0) return value;
  const parts = value.split(BBOX_DELIMITER).map((part) => Number(part.trim()));
  if (parts.length !== BBOX_LENGTH || parts.some((n) => Number.isNaN(n))) {
    return value;
  }
  return parts;
}

export class ListListingsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by city name.',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Minimum price (inclusive).',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price (inclusive).',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Exact number of bedrooms.',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({
    description:
      'Bounding box as "minLat,minLng,maxLat,maxLng" (e.g. "48.80,2.30,48.90,2.40").',
    example: '48.80,2.30,48.90,2.40',
  })
  @IsOptional()
  @Transform(parseBbox, { toClassOnly: true })
  @IsArray()
  @ArrayMinSize(BBOX_LENGTH)
  @ArrayMaxSize(BBOX_LENGTH)
  @Validate(IsBoundingBoxConstraint)
  bbox?: BoundingBox;

  @ApiPropertyOptional({
    description: 'Page number (1-indexed).',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Page size (max 100).',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}

export { IsBoundingBoxConstraint };
