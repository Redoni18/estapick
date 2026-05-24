'use client';

import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import { createPriceIcon } from './createPriceIcon';
import { MapListingPopup } from './MapListingPopup';
import { CARTO_TILES_ATTRIBUTION, getCartoTilesUrl } from './tiles';
import { useTheme } from '@/components/ThemeProvider';

// Monotonic counter advanced once per DetailMap mount. See `mapKey` below for
// why we need a unique-per-mount value; a counter keeps the useMemo factory
// pure (no `Math.random` / `Date.now` impure calls during render).
let detailMapInstanceCount = 0;

interface DetailMapProps {
  latitude: number;
  longitude: number;
  title: string;
  price: number;
  city: string;
  bedrooms: number;
  area: number;
  image?: string;
}

export function DetailMap({
  latitude,
  longitude,
  title,
  price,
  city,
  bedrooms,
  area,
  image,
}: DetailMapProps) {
  const { theme } = useTheme();
  const position: [number, number] = [latitude, longitude];
  const markerRef = useRef<LeafletMarker | null>(null);

  // See ListingsMap.tsx for the full rationale — works around the react-leaflet
  // "Map container is being reused by another instance" error under React 19
  // StrictMode and Webpack Fast Refresh by forcing a fresh DOM node per mount.
  const mapKey = useMemo(
    () => `detail-map-${++detailMapInstanceCount}`,
    [],
  );

  useEffect(() => {
    markerRef.current?.openPopup();
  }, []);

  return (
    <div className="relative isolate z-0 h-full w-full rounded-2xl border border-surface-2 [&_.leaflet-container]:rounded-2xl">
      <MapContainer key={mapKey} center={position} zoom={15} className="w-full h-full" zoomControl={false}>
        <TileLayer
          key={theme}
          attribution={CARTO_TILES_ATTRIBUTION}
          url={getCartoTilesUrl(theme)}
        />
        <Marker
          position={position}
          icon={createPriceIcon({ price, selected: true })}
          ref={markerRef}
        >
          <Popup maxWidth={240} minWidth={240} closeButton autoPan>
            <MapListingPopup
              title={title}
              price={price}
              city={city}
              bedrooms={bedrooms}
              area={area}
              image={image}
            />
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default DetailMap;
