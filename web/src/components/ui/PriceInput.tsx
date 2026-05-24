import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/format';

export interface PriceInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function PriceInput({ label, className, id, ...rest }: PriceInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-3xs uppercase font-bold text-subtle tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-2.5 text-subtle text-xs">$</span>
        <input
          id={id}
          type="number"
          {...rest}
          className={cn(
            'w-full bg-surface-1 border border-surface-3 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-brand transition',
            className,
          )}
        />
      </div>
    </div>
  );
}
