'use client';

import { useEffect, useState } from 'react';
import { getCityListingPreviews } from '@/lib/api/listings';
import { getErrorMessage } from '@/lib/format';
import type { CityListingPreview } from '@/types/listing';

let cachedPreviews: CityListingPreview[] | null = null;
let inflightRequest: Promise<CityListingPreview[]> | null = null;

async function loadCityPreviews(): Promise<CityListingPreview[]> {
  if (cachedPreviews) return cachedPreviews;
  if (inflightRequest) return inflightRequest;

  inflightRequest = getCityListingPreviews()
    .then((previews) => {
      cachedPreviews = previews;
      return previews;
    })
    .finally(() => {
      inflightRequest = null;
    });

  return inflightRequest;
}

export function useCityListingPreviews(enabled: boolean) {
  const [previewsByCity, setPreviewsByCity] = useState<
    Record<string, CityListingPreview>
  >(() =>
    cachedPreviews
      ? Object.fromEntries(cachedPreviews.map((preview) => [preview.city, preview]))
      : {},
  );
  const [isLoading, setIsLoading] = useState(enabled && !cachedPreviews);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || cachedPreviews) return;

    let cancelled = false;
    setIsLoading(true);

    void loadCityPreviews()
      .then((previews) => {
        if (cancelled) return;
        setPreviewsByCity(
          Object.fromEntries(previews.map((preview) => [preview.city, preview])),
        );
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { previewsByCity, isLoading, error };
}
