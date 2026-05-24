import { Test, TestingModule } from '@nestjs/testing';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import type { CreateListingDto } from './dto/create-listing.dto';
import type { ListListingsQueryDto } from './dto/list-listings-query.dto';

describe('ListingsController', () => {
  let controller: ListingsController;
  let service: jest.Mocked<
    Pick<ListingsService, 'findAll' | 'findOne' | 'create' | 'getCitySummaries'>
  >;

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
      findOne: jest.fn().mockResolvedValue({
        id: 'test-id',
        title: 'Mock Property',
      }),
      create: jest.fn().mockResolvedValue({
        id: 'new-id',
        title: 'Created Property',
      }),
      getCitySummaries: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingsController],
      providers: [{ provide: ListingsService, useValue: service }],
    }).compile();

    controller = module.get(ListingsController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('forwards the query DTO to the service', async () => {
      const query = { page: 1, limit: 10 } as ListListingsQueryDto;
      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
    });
  });

  describe('findOne', () => {
    it('forwards the id to the service', async () => {
      const result = await controller.findOne('test-id');

      expect(service.findOne).toHaveBeenCalledWith('test-id');
      expect(result).toEqual({ id: 'test-id', title: 'Mock Property' });
    });
  });

  describe('create', () => {
    it('forwards the create DTO to the service', async () => {
      const dto = { title: 'X' } as unknown as CreateListingDto;
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 'new-id', title: 'Created Property' });
    });
  });
});
