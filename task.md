# NestJS Backend API Implementation Tasks

- [ ] Install `@prisma/client`, run migrations to set up the SQLite database, and configure Prisma. <!-- id: 0 -->
- [ ] Add dependencies like `class-validator` and `class-transformer` for DTO validation. <!-- id: 1 -->
- [ ] Write a seed script in `prisma/seed.ts` that populates the SQLite database with 15-20 mock properties across 2-3 cities (Paris, San Francisco, Tokyo) with realistic coordinates. <!-- id: 2 -->
- [ ] Setup a global ValidationPipe in `src/main.ts` with transform enabled. <!-- id: 3 -->
- [ ] Create a NestJS ListingsModule to house listings logic. <!-- id: 4 -->
- [ ] Implement `GET /listings` supporting query validation (city, minPrice/maxPrice, bedrooms, bbox, pagination). <!-- id: 5 -->
- [ ] Implement `GET /listings/:id` to retrieve a single property with its images (404 if not found). <!-- id: 6 -->
- [ ] Implement `POST /listings` with payload validation using DTOs and class-validator (400 on invalid input). <!-- id: 7 -->
- [ ] Verify endpoints work properly by writing and running integration/e2e tests. <!-- id: 8 -->
