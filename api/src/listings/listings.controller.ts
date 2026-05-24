import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListListingsQueryDto } from './dto/list-listings-query.dto';
import {
  ListingEntity,
  PaginatedListingsResponse,
} from './entities/listing.entity';
import { CityListingPreviewEntity } from './entities/city-listing-preview.entity';
import type { CityListingPreview } from './entities/city-listing-preview.type';

type CitySummariesProvider = {
  getCitySummaries(): Promise<CityListingPreview[]>;
};

@ApiTags('listings')
@ApiTooManyRequestsResponse({ description: 'Rate limit exceeded.' })
// Default: routes only consume the "read" bucket. POST overrides below.
@SkipThrottle({ write: true })
@Controller({ path: 'listings', version: '1' })
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SkipThrottle({ read: true, write: false })
  @ApiOperation({ summary: 'Create a new listing.' })
  @ApiCreatedResponse({ type: ListingEntity })
  @ApiBadRequestResponse({
    description: 'Validation failed for the request body.',
  })
  create(@Body() dto: CreateListingDto): Promise<ListingEntity> {
    return this.listingsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List listings with optional filters and pagination.',
  })
  @ApiOkResponse({ type: PaginatedListingsResponse })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  findAll(
    @Query() query: ListListingsQueryDto,
  ): Promise<PaginatedListingsResponse> {
    return this.listingsService.findAll(query);
  }

  @Get('cities/summary')
  @ApiOperation({
    summary: 'Preview listing counts and sample images by city.',
  })
  @ApiOkResponse({ type: CityListingPreviewEntity, isArray: true })
  getCitySummaries(): Promise<CityListingPreview[]> {
    const provider: CitySummariesProvider = this.listingsService;
    return provider.getCitySummaries();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single listing by id.' })
  @ApiParam({ name: 'id', description: 'Listing UUID.', format: 'uuid' })
  @ApiOkResponse({ type: ListingEntity })
  @ApiNotFoundResponse({ description: 'No listing found for the given id.' })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ListingEntity> {
    return this.listingsService.findOne(id);
  }
}
