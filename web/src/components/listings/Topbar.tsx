'use client';

import { SlidersHorizontal } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Brand } from './Brand';
import { CitySelector } from './CitySelector';

interface TopbarProps {
  city: string;
  onCityChange: (city: string) => void;
  onToggleFilters: () => void;
}

export function Topbar({
  city,
  onCityChange,
  onToggleFilters,
}: TopbarProps) {
  return (
    <header className="z-30 shrink-0 border-b border-surface-2 bg-surface-1/95 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Mobile row 1: brand + actions. At sm+, children flatten into the main row. */}
        <div className="flex items-center justify-between gap-3 sm:contents">
          <Brand />

          <div className="flex shrink-0 items-center gap-2 sm:order-last">
            <ThemeToggle />
            <button
              type="button"
              onClick={onToggleFilters}
              aria-label="Open filters"
              className="flex sm:hidden min-h-10 min-w-10 items-center justify-center rounded-lg border border-surface-2 bg-surface-1 transition hover:bg-surface-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile row 2: full-width city search. Desktop: centered between brand and actions. */}
        <div className="w-full min-w-0 sm:mx-auto sm:max-w-[320px] sm:flex-1">
          <CitySelector value={city} onChange={onCityChange} />
        </div>
      </div>
    </header>
  );
}
