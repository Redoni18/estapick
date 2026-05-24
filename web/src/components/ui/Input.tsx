import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/format';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      {...rest}
      className={cn(
        'w-full bg-surface-1 border border-surface-3 rounded-lg px-3 py-2 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-brand transition',
        className,
      )}
    />
  );
});
