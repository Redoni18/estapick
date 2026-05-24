import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/format';

type Variant = 'primary' | 'ghost' | 'surface' | 'danger';
type Size = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-brand hover:bg-brand-hover text-white shadow-lg shadow-blue-500/10',
  ghost:
    'bg-transparent text-muted hover:text-foreground hover:bg-surface-2',
  surface:
    'bg-surface-1 border border-surface-2 text-foreground hover:bg-surface-2',
  danger:
    'bg-red-900/40 border border-red-700/30 text-red-200 hover:bg-red-900/60',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition disabled:opacity-55 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </button>
  );
}
