import type {
  CityListingPreview,
  Listing,
  ListingFilters,
  ListingListResponse,
} from '@/types/listing';

const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// Prefix that targets the versioned listings API on the NestJS backend.
const LISTINGS_PATH = '/api/v1/listings';

// Used for server-side fetches inside Docker where the API isn't reachable on
// localhost. Falls back to the public URL so local dev keeps working.
function getServerApiUrl(): string {
  if (typeof window !== 'undefined') return PUBLIC_API_URL;
  return process.env.INTERNAL_API_URL ?? PUBLIC_API_URL;
}

function buildListingsUrl(path = ''): string {
  return `${getServerApiUrl()}${LISTINGS_PATH}${path}`;
}

function buildListingsQuery(filters: ListingFilters): string {
  const params = new URLSearchParams();
  if (filters.city && filters.city !== 'all') params.append('city', filters.city);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.bedrooms && filters.bedrooms !== 'all') {
    params.append('bedrooms', filters.bedrooms);
  }
  if (filters.bbox) params.append('bbox', filters.bbox);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));
  return params.toString();
}

export async function getListings(
  filters: ListingFilters,
  init?: RequestInit,
): Promise<ListingListResponse> {
  const qs = buildListingsQuery(filters);
  const url = qs ? `${buildListingsUrl()}?${qs}` : buildListingsUrl();

  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error('Failed to fetch listings');
  }
  return (await response.json()) as ListingListResponse;
}

export async function getCityListingPreviews(
  init?: RequestInit,
): Promise<CityListingPreview[]> {
  const response = await fetch(buildListingsUrl('/cities/summary'), init);
  if (!response.ok) {
    throw new Error('Failed to fetch city previews');
  }
  return (await response.json()) as CityListingPreview[];
}

export class ListingNotFoundError extends Error {
  constructor(id: string) {
    super(`Listing ${id} not found`);
    this.name = 'ListingNotFoundError';
  }
}

export async function getListingById(
  id: string,
  init?: RequestInit,
): Promise<Listing> {
  const response = await fetch(buildListingsUrl(`/${id}`), init);

  if (response.status === 404) {
    throw new ListingNotFoundError(id);
  }
  if (!response.ok) {
    throw new Error('Failed to load property details');
  }
  return (await response.json()) as Listing;
}
