'use client';

import { FiltersPanel } from './FiltersPanel';
import { ListingsList } from './ListingsList';
import { cn } from '@/lib/format';
import type { Listing } from '@/types/listing';

interface ListingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;

  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  visibleCount: number;
  totalCount: number;
  onFilterChange: (next: { minPrice?: string; maxPrice?: string; bedrooms?: string }) => void;

  listings: Listing[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

export function ListingsSidebar({
  isOpen,
  onClose,
  minPrice,
  maxPrice,
  bedrooms,
  visibleCount,
  totalCount,
  onFilterChange,
  listings,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  selectedId,
  onSelect,
  onLoadMore,
  onRetry,
}: ListingsSidebarProps) {
  return (
    <aside
      className={cn(
        'absolute sm:relative inset-y-0 left-0 w-full sm:w-[480px] lg:w-[520px] bg-surface-1 sm:bg-surface-1 border-r border-surface-2 flex flex-col z-20 transition-transform duration-300 shadow-sm sm:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
      )}
    >
      <FiltersPanel
        minPrice={minPrice}
        maxPrice={maxPrice}
        bedrooms={bedrooms}
        visibleCount={visibleCount}
        totalCount={totalCount}
        onChange={onFilterChange}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <ListingsList
          listings={listings}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          error={error}
          hasMore={hasMore}
          selectedId={selectedId}
          onSelect={onSelect}
          onLoadMore={onLoadMore}
          onRetry={onRetry}
        />
      </div>
    </aside>
  );
}
