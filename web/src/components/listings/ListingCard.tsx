'use client';

import Link from 'next/link';
import { BedDouble, Home } from 'lucide-react';
import { cn, formatPrice } from '@/lib/format';
import type { Listing } from '@/types/listing';

interface ListingCardProps {
  listing: Listing;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ListingCard({ listing, isSelected, onSelect }: ListingCardProps) {
  return (
    <div
      id={`card-${listing.id}`}
      onClick={() => onSelect(listing.id)}
      className={cn(
        'rounded-xl border p-3 flex gap-4 cursor-pointer transition-all duration-300 card-hover-effect',
        isSelected
          ? 'bg-brand/10 border-brand shadow-md shadow-blue-500/10 z-10'
          : 'bg-surface-1 border-surface-2 hover:border-surface-3 shadow-sm',
      )}
    >
      <div className="w-32 h-24 rounded-lg bg-surface-1 overflow-hidden shrink-0 relative">
        {listing.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-faint">
            <Home className="w-6 h-6" />
          </div>
        )}
        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-surface-1/95 backdrop-blur-md border border-surface-2 text-[9px] font-semibold text-muted">
          {listing.city}
        </div>
      </div>

      <div className="flex-1 flex flex-col py-0.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-xs text-foreground line-clamp-1 leading-snug">
            {listing.title}
          </h3>
          <Link
            href={`/listings/${listing.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-2xs font-semibold text-brand hover:text-brand-hover shrink-0 self-center transition"
          >
            View Details
          </Link>
        </div>

        <p className="text-2xs text-subtle mt-1 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-3xs text-muted">
            <span className="flex items-center gap-1">
              <BedDouble className="w-3 h-3 text-subtle" />
              {listing.bedrooms} Bed
            </span>
            <span>•</span>
            <span>{listing.area} m²</span>
          </div>
          <span className="text-xs font-bold text-brand">
            {formatPrice(listing.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
