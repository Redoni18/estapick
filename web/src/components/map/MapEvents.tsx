'use client';

import { useCallback, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';

interface MapEventsProps {
  onBoundsChange?: (bbox: string) => void;
}

function getBboxString(map: LeafletMap): string {
  const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return `${sw.lat.toFixed(6)},${sw.lng.toFixed(6)},${ne.lat.toFixed(6)},${ne.lng.toFixed(6)}`;
}

export function MapEvents({ onBoundsChange }: MapEventsProps) {
  const map = useMapEvents({
    moveend: () => fire(),
    zoomend: () => fire(),
  });

  const fire = useCallback(() => {
    if (!onBoundsChange) return;
    onBoundsChange(getBboxString(map));
  }, [map, onBoundsChange]);

  // Emit once after mount so the initial viewport-bound query runs.
  useEffect(() => {
    fire();
  }, [fire]);

  return null;
}
