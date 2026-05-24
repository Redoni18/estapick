'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { Listing } from '@/types/listing';

interface MapControllerProps {
  center: [number, number];
  zoom: number;
  selectedProperty?: Listing;
}

// Drives the map view from external state: pans to the selected listing or
// falls back to the user-chosen city center/zoom when nothing is selected.
export function MapController({ center, zoom, selectedProperty }: MapControllerProps) {
  const map = useMap();

  // Fly to the listing only when selection changes — not when the listings
  // array refetches and produces a new object reference for the same id.
  useEffect(() => {
    if (!selectedProperty) return;

    map.setView(
      [selectedProperty.latitude, selectedProperty.longitude],
      14,
      { animate: true, duration: 0.8 },
    );
  }, [selectedProperty?.id, selectedProperty?.latitude, selectedProperty?.longitude, map]);

  // Restore city viewport when selection is cleared (e.g. city change).
  //
  // We MUST close any open popup before `setView` here. Leaflet's `Popup`
  // (when `autoPan: true`, the default) registers a `moveend` handler that
  // re-pans the map toward the popup if it ends up offscreen. After a city
  // switch (e.g. Tokyo → Paris), the previous city's marker is offscreen, so
  // the autoPan would yank the map straight back to the old city — visually
  // breaking the switch and tricking `handleBoundsChange` into reverting the
  // city filter to the old city (see `findNearestCity`).
  //
  // Animation is disabled because a city change can be a cross-continent jump
  // and Leaflet's pan animation would literally scroll across every
  // intermediate landmass instead of teleporting.
  useEffect(() => {
    if (selectedProperty) return;

    map.closePopup();
    map.setView(center, zoom, { animate: false });
  }, [center, zoom, selectedProperty?.id, map]);

  return null;
}
