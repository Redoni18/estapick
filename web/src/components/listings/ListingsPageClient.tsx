'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Topbar } from './Topbar';
import { ListingsSidebar } from './ListingsSidebar';
import { Spinner } from '@/components/ui/Spinner';
import { useListings } from '@/hooks/useListings';
import {
  CITY_COORDINATES,
  DEFAULT_CITY,
  findNearestCity,
} from '@/lib/constants';

// "minLat,minLng,maxLat,maxLng" — produced by MapEvents.getBboxString.
function parseBboxCenter(bbox: string): [number, number] | undefined {
  const parts = bbox.split(',').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return undefined;
  const [minLat, minLng, maxLat, maxLng] = parts;
  return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
}

// Leaflet touches `window` at module evaluation; keep the listings map
// client-only and rendered as an SSR-skipped dynamic import.
const ListingsMap = dynamic(
  () => import('@/components/map/ListingsMap').then((m) => m.ListingsMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-surface-1 border-l border-surface-2">
        <Spinner className="w-8 h-8" label="Loading map tiles..." />
      </div>
    ),
  },
);

export function ListingsPageClient() {
  const map = useListings();

  const [mapCenter, setMapCenter] = useState<[number, number]>(
    CITY_COORDINATES[DEFAULT_CITY].center,
  );
  const [mapZoom, setMapZoom] = useState<number>(CITY_COORDINATES[DEFAULT_CITY].zoom);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCityChange = useCallback(
    (city: string) => {
      map.setFilters({ city });
      // Drop the previous city's bbox. `filters` and `bbox` each have their
      // own 150ms `useDebouncedValue` timer; without this, the filters timer
      // can fire ~1ms before the bbox timer and send a wasted query of
      // `{ city: <new>, bbox: <previous-city-bbox> }` that always returns
      // zero rows. The fresh bbox is restored by `MapEvents` as soon as the
      // map view jumps to the new city.
      map.setBbox('');
      const coords = CITY_COORDINATES[city];
      if (coords) {
        setMapCenter(coords.center);
        setMapZoom(coords.zoom);
      }
      setSelectedId(undefined);
    },
    [map],
  );

  // When the user pans/zooms the map, push the bbox to the query AND reconcile
  // the city filter to whichever configured city now sits closest to the
  // viewport. Without this, the backend AND-combines a stale `city=Paris` with
  // a fresh `bbox` over Tokyo and returns zero listings. We deliberately do
  // NOT update mapCenter/mapZoom here so MapController doesn't re-pan the map
  // and cause a feedback loop.
  const handleBoundsChange = useCallback(
    (bbox: string) => {
      map.setBbox(bbox);

      const center = parseBboxCenter(bbox);
      if (!center) return;

      const nearestCity = findNearestCity(center);
      if (nearestCity && nearestCity !== map.filters.city) {
        map.setFilters({ city: nearestCity });
        setSelectedId(undefined);
      }
    },
    [map],
  );

  const handleSelectListing = useCallback((id: string) => {
    setSelectedId(id);
    // Scroll the matching card into view after the marker click reaches React.
    setTimeout(() => {
      document
        .getElementById(`card-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface-0 text-foreground">
      <Topbar
        city={map.filters.city}
        onCityChange={handleCityChange}
        onToggleFilters={() => setIsFiltersOpen((open) => !open)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <ListingsSidebar
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          minPrice={map.filters.minPrice}
          maxPrice={map.filters.maxPrice}
          bedrooms={map.filters.bedrooms}
          visibleCount={map.listings.length}
          totalCount={map.total}
          onFilterChange={map.setFilters}
          listings={map.listings}
          isLoading={map.isLoading}
          isLoadingMore={map.isLoadingMore}
          error={map.error}
          hasMore={map.hasMore}
          selectedId={selectedId}
          onSelect={handleSelectListing}
          onLoadMore={map.loadMore}
          onRetry={map.refetch}
        />

        <main className="flex-1 h-full z-10">
          <ListingsMap
            properties={map.listings}
            center={mapCenter}
            zoom={mapZoom}
            selectedId={selectedId}
            onBoundsChange={handleBoundsChange}
            onSelectProperty={handleSelectListing}
          />
        </main>
      </div>
    </div>
  );
}
