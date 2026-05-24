export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  images: string[];
  createdAt: string;
}

export interface ListingsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListingListResponse {
  data: Listing[];
  meta: ListingsMeta;
}

export interface CityListingPreview {
  city: string;
  count: number;
  previewImages: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface ListingFilters {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bbox?: string;
  page?: number;
  limit?: number;
}
