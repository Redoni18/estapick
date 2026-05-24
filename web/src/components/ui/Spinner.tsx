import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/format';

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <Loader2 className={cn('w-4 h-4 animate-spin text-brand', className)} />
      {label && <span className="text-xs text-muted">{label}</span>}
    </span>
  );
}
