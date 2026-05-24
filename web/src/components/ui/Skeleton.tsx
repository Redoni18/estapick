import { cn } from '@/lib/format';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded bg-surface-1', className)}
    />
  );
}
