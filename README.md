# Estapick Real Estate

This repository contains a full-stack real estate marketplace slice with a **NestJS API** backend and a **Next.js App Router** frontend, implementing interactive map search, real-time listings filters, coordinate bounding-box syncing, and a property detail view.

The API is versioned (`/api/v1`), validated end-to-end with `class-validator` DTOs, observed via a `/api/health` probe (Terminus), and documented through Swagger UI at [http://localhost:3001/api/docs](http://localhost:3001/api/docs).

---

## Project Structure

```bash
estapick-takehome/
├── api/                              # NestJS API Backend (listening on port 3001)
│   ├── prisma/
│   │   ├── schema.prisma             # Listing model + Postgres provider
│   │   └── seed.ts                   # ~120 sample listings (Paris, SF, Tokyo)
│   ├── src/
│   │   ├── main.ts                   # Bootstrap, Swagger, global pipes/filters
│   │   ├── app.module.ts             # Root module — config, throttling, feature imports
│   │   ├── config/
│   │   │   └── configuration.ts      # Joi-validated env schema
│   │   ├── common/
│   │   │   ├── filters/              # AllExceptionsFilter
│   │   │   └── interceptors/         # LoggingInterceptor
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts      # @Global() PrismaModule
│   │   │   └── prisma.service.ts
│   │   ├── health/
│   │   │   ├── health.module.ts
│   │   │   └── health.controller.ts  # /api/health (Terminus)
│   │   └── listings/
│   │       ├── listings.module.ts
│   │       ├── listings.controller.ts
│   │       ├── listings.service.ts
│   │       ├── dto/                    # CreateListingDto, ListListingsQueryDto
│   │       └── entities/               # Listing + city preview response types
│   └── test/                           # e2e specs (listings, throttler)
└── web/                              # Next.js App Router Frontend (listening on port 3000)
    └── src/
        ├── app/
        │   ├── page.tsx              # Root redirect to /listings
        │   ├── error.tsx             # Root error boundary (client)
        │   └── listings/
        │       ├── page.tsx          # Listings shell — renders <ListingsPageClient />
        │       └── [id]/
        │           ├── page.tsx      # Server Component, fetches the listing
        │           ├── loading.tsx   # Streamed skeleton for the detail page
        │           ├── not-found.tsx # Triggered by notFound() on a 404
        │           └── error.tsx     # Detail-route error boundary (client)
        ├── components/
        │   ├── ui/                   # Headless primitives (Button, Input, Skeleton, ...)
        │   ├── listings/             # Listings feature (Topbar, Sidebar, Card, ...)
        │   ├── listings/detail/      # Detail feature (ImageGallery, ContactForm, ...)
        │   └── map/                  # Leaflet maps + shared icon/tiles
        ├── hooks/                    # useListings, useCityListingPreviews, useDebouncedValue
        ├── lib/                      # api/listings.ts, format.ts, constants.ts
        └── types/                    # Single source of truth for Listing
```

---

## Quick Start with Docker (Recommended)

### Prerequisites
- **Docker**: Version 20 or newer
- **Docker Compose**: Version 2 or newer

### Run the full stack (development with hot reload)

From the repository root:

```bash
docker compose up --build
```

This starts **PostgreSQL**, the API, and the frontend with **hot reload** enabled:
- **Frontend**: [http://localhost:3000/listings](http://localhost:3000/listings) — Next.js dev server; edits under `web/src/` reload automatically. `/` redirects to `/listings`.
- **API**: [http://localhost:3001](http://localhost:3001) — NestJS watch mode; edits under `api/src/` restart the server automatically

Source directories are bind-mounted into the containers, so you can edit files locally and see changes without rebuilding images.

On first launch, the API container automatically applies the database schema and seeds sample listings (Paris, San Francisco, Tokyo). The assignment brief asks for 15–20 listings across 2–3 cities; we seed ~120 instead so the map has enough density for pan/zoom testing. PostgreSQL data is persisted in a Docker volume (`postgres-data`).

### Production-like Docker build

For an optimized production build without hot reload:

```bash
docker compose -f docker-compose.prod.yml up --build
```

### Useful Docker commands

```bash
# Run in the background
docker compose up --build -d

# Stop containers
docker compose down

# Stop containers and remove the database volume
docker compose down -v

# View logs
docker compose logs -f
```

---

## Quick Start (How to Run Locally)

### Prerequisites
- **Node.js**: Version 18 or newer
- **npm**: Version 9 or newer
- **PostgreSQL**: Version 14 or newer (running locally on port 5432), or use Docker Compose above

---

### Step 1: Spin up the API backend

1. Navigate to the `api` folder and install dependencies:
   ```bash
   cd api
   npm install
   ```
2. Copy the example env file and ensure PostgreSQL is running:
   ```bash
   cp .env.example .env
   ```
3. Apply the database schema:
   ```bash
   npx prisma db push
   ```
4. Seed the database with mock properties (Paris, San Francisco, Tokyo). The brief asks for 15–20 listings; the seed script inserts ~120 for richer map coverage:
   ```bash
   npx prisma db seed
   ```
5. Start the backend developer server:
   ```bash
   npm run start:dev
   ```
The backend server runs locally on **`http://localhost:3001`**.

---

### Step 2: Spin up the Next.js frontend

1. Navigate to the `web` folder and install dependencies:
   ```bash
   cd web
   npm install
   ```
2. Start the Next.js developer server:
   ```bash
   npm run dev
   ```
The frontend server runs locally on **`http://localhost:3000`**. Open [http://localhost:3000/listings](http://localhost:3000/listings) in your browser to view the app (`/` redirects there).

---

## API Surface

All endpoints live under the `/api/v1` prefix:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/v1/listings` | List listings with optional `city` (case-insensitive), `minPrice`, `maxPrice`, `bedrooms`, `bbox` (`minLat,minLng,maxLat,maxLng`), `page`, `limit` filters. Returns `{ data, meta }`. |
| `GET` | `/api/v1/listings/cities/summary` | Preview listing availability by city. Returns an array of `{ city, count, previewImages, minPrice?, maxPrice? }` — used by the city selector dropdown to show thumbnail previews, counts, and price ranges before a city is selected. Only cities with at least one listing appear in the response. |
| `GET` | `/api/v1/listings/:id` | Fetch a single listing (404 if missing, 400 if the id is not a UUID). |
| `POST` | `/api/v1/listings` | Create a listing. Body is validated by `CreateListingDto` (400 on invalid). |
| `GET` | `/api/health` | Terminus liveness probe (pings Prisma). Exempt from rate limiting. |
| `GET` | `/api/docs` | Swagger UI (disabled in production via `SWAGGER_ENABLED=false`). |

All `/api/v1/listings*` routes are rate-limited per IP (429 on overflow). See [Rate Limiting](#7-tiered-rate-limiting-per-ip) below.

---

## Testing

The backend ships with both unit and end-to-end suites.

```bash
cd api
npm run test         # ListingsService + ListingsController unit tests
npm run test:e2e     # Boots AppModule against PostgreSQL (estapick_test database)
```

`test:e2e` resets and provisions schema on `estapick_test` via Prisma's `db push`, so it never touches the dev database. With Docker Compose, the test database is created automatically on first Postgres startup; for local Postgres, create it once with `createdb estapick_test`.

---

## Architectural Decisions & Trade-Offs

### 1. Database: PostgreSQL with Prisma
- **Decision**: PostgreSQL was chosen as the database engine, as recommended in the assignment brief.
- **Trade-off/Rationale**: Postgres is production-grade, supports concurrent writes, and matches what Estapick uses in real deployments. Prisma provides full type safety, easy schema management, and clean query mechanics. Docker Compose runs a local Postgres 16 instance so reviewers don't need a separate install.

### 2. Detail page is a React Server Component, listings page is a client island
- **Decision**: `app/listings/[id]/page.tsx` is an `async` Server Component that fetches the listing on the server via `getListingById`, exports `generateMetadata` for per-listing SEO titles/descriptions, and uses route segment files (`loading.tsx`, `not-found.tsx`, `error.tsx`) for state handling. Only the inherently interactive pieces — `ImageGallery`, `ContactForm`, and the Leaflet map — are `'use client'` islands rendered inside the server-rendered shell.
- **Decision**: `app/listings/page.tsx` delegates to a (thin) client tree because the listings experience is built around live state: filter inputs, debounced refetches, map↔list bounding-box sync via `useMapEvents`, and marker↔card selection. An RSC there would just hand control straight to a client wrapper, so the page is kept as a small client shell that delegates to `useListings`. `app/page.tsx` is a server-side `redirect('/listings')` so the root URL still resolves cleanly.
- **Trade-off/Rationale**: The detail page now ships less JavaScript to the browser, gets server-side data fetching (no client waterfall, no spinner on first paint), and earns SEO-friendly metadata. The listings page keeps its interactive UX without paying for an extra server-to-client boundary that wouldn't buy anything.

### 3. Next.js Client-Side Leaflet Maps (Dynamic Import)
- **Decision**: Both `ListingsMap` and `DetailMap` are loaded via `dynamic(() => import(...), { ssr: false })`.
- **Trade-off/Rationale**: Leaflet touches `window`/`document` at module evaluation, so it can't be rendered on the server. The dynamic import keeps it client-only while letting the surrounding shell — including the entire detail page — render on the server.

### 4. Internal vs. public API URL
- **Decision**: The API client (`src/lib/api/listings.ts`) reads `INTERNAL_API_URL` when running on the server and falls back to `NEXT_PUBLIC_API_URL` for the browser.
- **Trade-off/Rationale**: Inside Docker, the Next.js server cannot reach the API through `http://localhost:3001` — it needs the compose service name (`http://api:3001`). The browser, on the other hand, must use the host-visible URL. Splitting the two makes the RSC fetch work in both local dev and containerized deploys without conditional code in components.

### 5. Coordinate Syncing (Map-to-List Bounding Box)
- **Decision**: Panning or zooming the map recalculates the map boundaries and updates the query parameters via the `bbox` filter. `useListings` debounces by 150ms and discards out-of-order responses so the UI never flickers back to a stale page.
- **Trade-off/Rationale**: This provides a highly interactive experience (similar to Airbnb) where moving the map automatically queries properties in real time, without hammering the API on every pixel of movement.

### 6. Versioned, validated, observable NestJS backend
- **Decision**: The API uses `setGlobalPrefix('api')` + URI versioning (`/api/v1/...`), `@nestjs/config` with a Joi-validated schema, a global `AllExceptionsFilter` (consistent error envelope), a `LoggingInterceptor` (per-request structured logs), `@nestjs/terminus` for `/api/health`, and `@nestjs/swagger` for `/api/docs`. The `PrismaService` lives in a dedicated `@Global() PrismaModule` and disconnects cleanly via `OnModuleDestroy`.
- **Trade-off/Rationale**: Versioning gives us a clear upgrade path without breaking existing clients. Centralising filters and interceptors means controllers stay focused on the happy path while still producing consistent error responses and request logs. Swagger doubles as living documentation for reviewers; Terminus drives the Docker healthcheck.

### 7. Tiered rate limiting (per IP)
- **Decision**: `@nestjs/throttler` is registered globally via `APP_GUARD` with two named buckets — `read` (default `120 req / 60s`) for listing reads, and `write` (default `10 req / 60s`) for `POST /listings`. `/api/health` is exempted via `@SkipThrottle()` so Docker healthchecks are never blocked. All limits are env-configurable.
- **Trade-off/Rationale**: A single global bucket would either be too tight for the map (panning/zooming fires bbox refetches) or too loose for the create endpoint (no auth, abuse-prone). Splitting reads from writes gives the listings UX headroom while keeping a small ceiling on creates. Storage is in-process memory — perfect for single-instance Docker but resets on restart and does not coordinate across replicas. Scaling out would mean swapping in the Redis storage adapter (`@nestjs/throttler-storage-redis`); the swap is local to `ThrottlerModule.forRootAsync` and would not touch controllers.

| Variable | Default | Purpose |
|---|---|---|
| `THROTTLE_ENABLED` | `true` | Master switch. The e2e setup forces this to `false` so existing tests are unaffected. |
| `THROTTLE_READ_TTL` | `60` (seconds) | Window for the read bucket (`GET /listings*`). |
| `THROTTLE_READ_LIMIT` | `120` | Max read requests per IP per window. |
| `THROTTLE_WRITE_TTL` | `60` (seconds) | Window for the write bucket (`POST /listings`). |
| `THROTTLE_WRITE_LIMIT` | `10` | Max create requests per IP per window. |

---

## Map Provider Setup & API Keys

- **Tiles**: We use open-source, public **CartoDB Dark Matter** map tiles:
  `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- **API Key**: No API keys, paid accounts, or accounts setup are required to run or test the map. It functions immediately upon page load.

---

## What We'd Build Next (If We Had Another Day)

1. **PostGIS spatial queries**: Swap the in-DTO bounding-box filter for native PostGIS geography columns + a GiST index so map pans stay fast as the dataset grows past tens of thousands of listings.
2. **URL-synced filters**: Persist city / price / bedrooms / bbox in the URL (`useSearchParams`) so reviewers can share a deep link to a specific map view and the browser back button restores prior filter state.
3. **Google Maps with city autocomplete**: Replace Leaflet with the Google Maps API and use Places Autocomplete for city search instead of the hardcoded city list — show suggestions as users type and let them pick a city from the dropdown.
4. **Create listing UI**: Add a frontend form so users can submit new listings through the app, rather than relying on the `POST /api/v1/listings` endpoint alone.

---

## AI Pair Programming Notes

- **Backend**: AI was used to set up the Prisma schema models and write DTOs with validation decorators, confirm that endpoints were working properly by writing test cases, and configure rate limiting.
- **UI**: AI helped generate the listings page layout — sidebar with cards on one side and the map on the other — along with the styling for the Leaflet map, listing cards, and price-badge pins.
- **Bug fixes**: Most bugs surfaced during testing were tracked down and fixed with AI assistance.
- **Pragmatism over over-engineering**: We focused on high-quality responsiveness, clean listings grids, visual feedback hover overlays, and robust sync features.

**Models & tooling**: Claude Opus 4.7 was the primary model — especially for UI work, where it tends to produce more polished layouts and styling. Composer 2.5 was used alongside it for lighter tasks where its lower cost made sense. Cursor served as the agentic coding editor throughout: it combines direct manual editing with an agent mode that has strong tool-calling and harness support, so you can switch between hands-on changes and delegated multi-step work in the same environment.
