import { Skeleton } from '@/components/ui/Skeleton';

export function ListingCardSkeleton() {
  return (
    <div className="rounded-xl border border-surface-2 bg-surface-1 p-3 flex gap-4">
      <Skeleton className="w-32 h-24 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2.5 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-auto" />
      </div>
    </div>
  );
}
