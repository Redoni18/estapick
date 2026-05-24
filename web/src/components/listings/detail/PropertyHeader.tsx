import { MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface PropertyHeaderProps {
  title: string;
  city: string;
  price: number;
}

export function PropertyHeader({ title, city, price }: PropertyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="w-3.5 h-3.5 text-subtle" />
          <span>Located in {city}</span>
        </div>
      </div>
      <div className="text-left sm:text-right shrink-0">
        <span className="text-3xs uppercase font-bold text-subtle block">
          Property Price
        </span>
        <span className="text-2xl font-black text-brand">{formatPrice(price)}</span>
      </div>
    </div>
  );
}
