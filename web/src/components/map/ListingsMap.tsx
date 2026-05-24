'use client';

import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import { MapController } from './MapController';
import { MapEvents } from './MapEvents';
import { createPriceIcon } from './createPriceIcon';
import { MapListingPopup } from './MapListingPopup';
import { CARTO_TILES_ATTRIBUTION, getCartoTilesUrl } from './tiles';
import { useTheme } from '@/components/ThemeProvider';
import type { Listing } from '@/types/listing';

let listingsMapInstanceCount = 0;

interface ListingsMapProps {
  properties: Listing[];
  center: [number, number];
  zoom: number;
  selectedId?: string;
  onBoundsChange?: (bbox: string) => void;
  onSelectProperty?: (id: string) => void;
}

export function ListingsMap({
  properties,
  center,
  zoom,
  selectedId,
  onBoundsChange,
  onSelectProperty,
}: ListingsMapProps) {
  const { theme } = useTheme();
  const selectedProperty = properties.find((p) => p.id === selectedId);
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

  const mapKey = useMemo(
    () => `listings-map-${++listingsMapInstanceCount}`,
    [],
  );

  useEffect(() => {
    if (!selectedId) return;
    markerRefs.current[selectedId]?.openPopup();
  }, [selectedId]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        key={mapKey}
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          key={theme}
          attribution={CARTO_TILES_ATTRIBUTION}
          url={getCartoTilesUrl(theme)}
        />

        <MapController center={center} zoom={zoom} selectedProperty={selectedProperty} />
        <MapEvents onBoundsChange={onBoundsChange} />

        {properties.map((property) => {
          const isSelected = property.id === selectedId;
          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createPriceIcon({ price: property.price, selected: isSelected })}
              ref={(ref) => {
                markerRefs.current[property.id] = ref;
              }}
              eventHandlers={{
                click: () => onSelectProperty?.(property.id),
              }}
            >
              <Popup maxWidth={240} minWidth={240} closeButton autoPan>
                <MapListingPopup
                  title={property.title}
                  price={property.price}
                  city={property.city}
                  bedrooms={property.bedrooms}
                  area={property.area}
                  image={property.images?.[0]}
                  href={`/listings/${property.id}`}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default ListingsMap;
