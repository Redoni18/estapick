import L from 'leaflet';
import { formatPriceCompact } from '@/lib/format';

interface CreatePriceIconOptions {
  price: number;
  selected?: boolean;
}

export function createPriceIcon({ price, selected = false }: CreatePriceIconOptions): L.DivIcon {
  const label = formatPriceCompact(price);

  const stateClasses = selected
    ? 'bg-brand border-white text-white scale-110 ring-4 ring-blue-500/30 z-10'
    : 'bg-surface-1 border-surface-3 text-foreground shadow-md hover:bg-surface-0 hover:border-brand/40';

  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="flex items-center justify-center px-2 py-0.5 rounded-full text-3xs sm:text-2xs font-bold shadow-lg transition-all duration-300 border ${stateClasses}">
        ${label}
      </div>
    `,
    iconSize: [52, 24],
    iconAnchor: [26, 12],
  });
}
