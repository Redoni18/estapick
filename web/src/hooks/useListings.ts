'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getListings } from '@/lib/api/listings';
import { getErrorMessage } from '@/lib/format';
import { FETCH_DEBOUNCE_MS, LISTINGS_PAGE_SIZE } from '@/lib/constants';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { Listing, ListingFilters } from '@/types/listing';

export interface ListingsFilterState {
  city: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

export interface UseListingsResult {
  listings: Listing[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  filters: ListingsFilterState;
  setFilters: (next: Partial<ListingsFilterState>) => void;
  bbox: string;
  setBbox: (next: string) => void;
  loadMore: () => void;
  refetch: () => void;
}

const INITIAL_FILTERS: ListingsFilterState = {
  city: 'Paris',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'all',
};

export function useListings(): UseListingsResult {
  const [filters, setFiltersState] = useState<ListingsFilterState>(INITIAL_FILTERS);
  const [bbox, setBbox] = useState('');

  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce the inputs that drive refetches so map panning + typing don't
  // hammer the API on every keystroke / move.
  const debouncedFilters = useDebouncedValue(filters, FETCH_DEBOUNCE_MS);
  const debouncedBbox = useDebouncedValue(bbox, FETCH_DEBOUNCE_MS);

  // Used to discard out-of-order responses if a newer request lands first.
  const requestIdRef = useRef(0);

  const runFetch = useCallback(
    async (nextFilters: ListingsFilterState, nextBbox: string, nextPage: number, append: boolean) => {
      const requestId = ++requestIdRef.current;
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const query: ListingFilters = {
          city: nextFilters.city,
          minPrice: nextFilters.minPrice || undefined,
          maxPrice: nextFilters.maxPrice || undefined,
          bedrooms: nextFilters.bedrooms,
          bbox: nextBbox || undefined,
          page: nextPage,
          limit: LISTINGS_PAGE_SIZE,
        };
        const result = await getListings(query);

        if (requestId !== requestIdRef.current) return;

        setListings((prev) => (append ? [...prev, ...result.data] : result.data));
        setTotal(result.meta.total);
        setPage(nextPage);
        setHasMore(nextPage < result.meta.totalPages);
        setError(null);
      } catch (err: unknown) {
        if (requestId !== requestIdRef.current) return;
        setError(getErrorMessage(err));
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    // Defer to a microtask so the synchronous `setIsLoading(true)` inside
    // `runFetch` doesn't run as part of the effect body itself (avoids the
    // React 19 `react-hooks/set-state-in-effect` cascade warning).
    void Promise.resolve().then(() => {
      if (cancelled) return;
      runFetch(debouncedFilters, debouncedBbox, 1, false);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedFilters, debouncedBbox, runFetch]);

  const setFilters = useCallback((next: Partial<ListingsFilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  }, []);

  const loadMore = useCallback(() => {
    if (isLoadingMore || isLoading || !hasMore) return;
    runFetch(debouncedFilters, debouncedBbox, page + 1, true);
  }, [debouncedFilters, debouncedBbox, hasMore, isLoading, isLoadingMore, page, runFetch]);

  const refetch = useCallback(() => {
    runFetch(debouncedFilters, debouncedBbox, 1, false);
  }, [debouncedFilters, debouncedBbox, runFetch]);

  return {
    listings,
    total,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    filters,
    setFilters,
    bbox,
    setBbox,
    loadMore,
    refetch,
  };
}
