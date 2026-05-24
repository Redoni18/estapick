'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Home, MapPin } from 'lucide-react';
import { CITY_NAMES } from '@/lib/constants';
import { cn, formatPriceCompact } from '@/lib/format';
import { useCityListingPreviews } from '@/hooks/useCityListingPreviews';
import { Input } from '@/components/ui/Input';
import type { CityListingPreview } from '@/types/listing';

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
}

const CITIES = CITY_NAMES;

function findCityMatch(query: string): string | undefined {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return undefined;
  return CITIES.find((city) => city.toLowerCase() === normalized);
}

function formatPriceRange(preview: CityListingPreview): string | null {
  if (preview.minPrice === undefined || preview.maxPrice === undefined) {
    return null;
  }
  if (preview.minPrice === preview.maxPrice) {
    return formatPriceCompact(preview.minPrice);
  }
  return `${formatPriceCompact(preview.minPrice)} – ${formatPriceCompact(preview.maxPrice)}`;
}

function CityPreview({ preview, isLoading }: { preview?: CityListingPreview; isLoading: boolean }) {
  if (isLoading && !preview) {
    return (
      <>
        <div className="h-3.5 w-16 shrink-0 rounded bg-surface-2 animate-pulse sm:hidden" />
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-md bg-surface-2 animate-pulse" />
          <div className="space-y-1">
            <div className="h-2.5 w-14 rounded bg-surface-2 animate-pulse" />
            <div className="h-2 w-20 rounded bg-surface-2 animate-pulse" />
          </div>
        </div>
      </>
    );
  }

  if (!preview || preview.count === 0) {
    return (
      <span className="text-2xs text-subtle shrink-0">No listings</span>
    );
  }

  const priceRange = formatPriceRange(preview);
  const countLabel = `${preview.count} ${preview.count === 1 ? 'listing' : 'listings'}`;

  return (
    <>
      <span className="text-2xs font-medium text-muted shrink-0 sm:hidden">
        {countLabel}
      </span>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <div className="flex -space-x-1.5">
          {preview.previewImages.length > 0 ? (
            preview.previewImages.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${image}-${index}`}
                src={image}
                alt=""
                aria-hidden="true"
                className="h-8 w-8 rounded-md border-2 border-surface-1 object-cover bg-surface-2"
              />
            ))
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-2 bg-surface-2 text-faint">
              <Home className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xs font-medium text-muted">{countLabel}</p>
          {priceRange && (
            <p className="text-3xs text-subtle">{priceRange}</p>
          )}
        </div>
      </div>
    </>
  );
}

export function CitySelector({ value, onChange }: CitySelectorProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const { previewsByCity, isLoading: isLoadingPreviews } = useCityListingPreviews(isOpen);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const normalizedQuery = query.trim().toLowerCase();
  const isBrowsing =
    normalizedQuery.length === 0 || normalizedQuery === value.toLowerCase();

  const suggestions = isBrowsing
    ? CITIES
    : CITIES.filter((city) => city.toLowerCase().includes(normalizedQuery));

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery(value);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen, value]);

  const selectCity = (city: string) => {
    setQuery(city);
    setIsOpen(false);
    if (city !== value) {
      onChange(city);
    }
  };

  const commitQuery = () => {
    const match = findCityMatch(query);
    if (match) {
      selectCity(match);
      return;
    }

    setQuery(value);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightIndex((index) => Math.min(index + 1, suggestions.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (isOpen && suggestions[highlightIndex]) {
        selectCity(suggestions[highlightIndex]);
        return;
      }
      commitQuery();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setQuery(value);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-label="City"
          placeholder="Search city"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(commitQuery, 0);
          }}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 py-2.5 text-sm"
        />
        <button
          type="button"
          aria-label="Show city suggestions"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setIsOpen((open) => !open);
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-foreground hover:bg-surface-2 transition"
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
          />
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="City suggestions"
          className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-50 max-h-72 overflow-y-auto rounded-xl border border-surface-2 bg-surface-1 shadow-lg"
        >
          {suggestions.map((city, index) => {
            const isHighlighted = index === highlightIndex;
            const isSelected = city === value;
            const preview = previewsByCity[city];

            return (
              <li key={city} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => selectCity(city)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition',
                    isHighlighted
                      ? 'bg-surface-2 text-foreground'
                      : 'text-muted hover:bg-surface-2 hover:text-foreground',
                    isSelected && 'font-semibold text-brand',
                  )}
                >
                  <span className="min-w-0 truncate text-sm">{city}</span>
                  <CityPreview preview={preview} isLoading={isLoadingPreviews} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && !isBrowsing && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-50 rounded-xl border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-subtle shadow-lg">
          No matching cities
        </div>
      )}
    </div>
  );
}
