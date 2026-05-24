'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/Spinner';

// Leaflet touches `window` at module evaluation, so it must stay client-only.
// `ssr: false` is only legal inside a Client Component (Next 16), so this
// thin wrapper exists purely to host the dynamic import.
const DetailMap = dynamic(
  () => import('@/components/map/DetailMap').then((m) => m.DetailMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-surface-1 border border-surface-2 rounded-2xl">
        <Spinner className="w-8 h-8" />
      </div>
    ),
  },
);

interface LocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  price: number;
  city: string;
  bedrooms: number;
  area: number;
  image?: string;
}

export function LocationMap(props: LocationMapProps) {
  return <DetailMap {...props} />;
}
