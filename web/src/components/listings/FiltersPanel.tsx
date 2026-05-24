'use client';

import { PriceInput } from '@/components/ui/PriceInput';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { BEDROOM_OPTIONS } from '@/lib/constants';

interface FiltersPanelProps {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  visibleCount: number;
  totalCount: number;
  onChange: (next: { minPrice?: string; maxPrice?: string; bedrooms?: string }) => void;
  onClose?: () => void;
}

const BEDROOM_SELECT_OPTIONS = BEDROOM_OPTIONS.map((value) => ({
  value,
  label: value === 'all' ? 'All' : `${value} BR`,
}));

export function FiltersPanel({
  minPrice,
  maxPrice,
  bedrooms,
  visibleCount,
  totalCount,
  onChange,
  onClose,
}: FiltersPanelProps) {
  return (
    <div className="p-4 border-b border-surface-2 bg-surface-0 space-y-4 shrink-0">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-sm">Filters</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">
            Showing <strong className="text-brand">{visibleCount}</strong> of{' '}
            <strong className="text-foreground">{totalCount}</strong> listings
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-muted hover:text-foreground sm:hidden"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PriceInput
          id="min-price"
          label="Min Price"
          value={minPrice}
          onChange={(e) => onChange({ minPrice: e.target.value })}
          placeholder="Any"
        />
        <PriceInput
          id="max-price"
          label="Max Price"
          value={maxPrice}
          onChange={(e) => onChange({ maxPrice: e.target.value })}
          placeholder="Any"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-3xs uppercase font-bold text-subtle tracking-wider">
          Bedrooms
        </label>
        <SegmentedControl
          ariaLabel="Bedrooms"
          value={bedrooms}
          options={BEDROOM_SELECT_OPTIONS}
          onChange={(value) => onChange({ bedrooms: value })}
        />
      </div>
    </div>
  );
}
