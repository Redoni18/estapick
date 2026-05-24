import type { ComponentType } from 'react';
import { Bath, BedDouble, Square } from 'lucide-react';

interface PropertyStatsProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
}

interface StatItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export function PropertyStats({ bedrooms, bathrooms, area }: PropertyStatsProps) {
  const items: StatItem[] = [
    { icon: BedDouble, label: 'Bedrooms', value: `${bedrooms} BR` },
    { icon: Bath, label: 'Bathrooms', value: `${bathrooms} BA` },
    { icon: Square, label: 'Area Size', value: `${area} m²` },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 border-y border-surface-2 py-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-0 border border-surface-2"
        >
          <Icon className="w-5 h-5 text-brand mb-1" />
          <span className="text-3xs font-bold text-subtle uppercase tracking-wider">
            {label}
          </span>
          <span className="text-sm font-bold text-foreground mt-0.5">{value}</span>
        </div>
      ))}
    </div>
  );
}
