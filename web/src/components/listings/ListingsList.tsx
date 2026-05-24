'use client';

import { Loader2, Search } from 'lucide-react';
import { ListingCard } from './ListingCard';
import { ListingCardSkeleton } from './ListingCardSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Listing } from '@/types/listing';

interface ListingsListProps {
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

const SKELETON_COUNT = 4;

export function ListingsList({
  listings,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  selectedId,
  onSelect,
  onLoadMore,
  onRetry,
}: ListingsListProps) {
  if (isLoading && listings.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error Loading Listings"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={<Search className="w-6 h-6 text-subtle" />}
        title="No properties in view"
        description="Try zoom out, pan the map, or clear some filters to discover listings."
      />
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isSelected={listing.id === selectedId}
          onSelect={onSelect}
        />
      ))}

      {hasMore && (
        <div className="pt-2 pb-6">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="w-full py-2.5 rounded-xl border border-surface-2 bg-surface-1 hover:bg-surface-0 text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-55 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Loading more...
              </>
            ) : (
              'Load More Listings'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
