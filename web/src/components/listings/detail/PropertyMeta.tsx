import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/format';

interface PropertyMetaProps {
  createdAt: string;
  latitude: number;
  longitude: number;
}

export function PropertyMeta({ createdAt, latitude, longitude }: PropertyMetaProps) {
  return (
    <div className="pt-2 flex flex-wrap items-center gap-4 text-3xs text-muted border-t border-surface-2">
      <span className="flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5" />
        Listed: {formatDate(createdAt)}
      </span>
      <span>•</span>
      <span>Latitude: {latitude}</span>
      <span>•</span>
      <span>Longitude: {longitude}</span>
    </div>
  );
}
