import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/format';

type Variant = 'surface' | 'overlay';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  surface:
    'bg-surface-1 border border-surface-2 text-muted hover:text-foreground hover:bg-surface-2',
  overlay:
    'bg-surface-0/70 border border-surface-2/40 text-muted hover:text-foreground hover:bg-surface-1',
};

export function IconButton({
  variant = 'surface',
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center rounded-lg p-2 transition',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
