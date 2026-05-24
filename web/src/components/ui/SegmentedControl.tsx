import { cn } from '@/lib/format';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: ReadonlyArray<SegmentedOption<T>>;
  onChange: (value: T) => void;
  variant?: 'default' | 'pills';
  className?: string;
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  variant = 'default',
  className,
  ariaLabel,
}: SegmentedControlProps<T>) {
  if (variant === 'pills') {
    return (
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(
          'flex items-center gap-1.5 bg-surface-0 p-1.5 rounded-xl border border-surface-2 shadow-sm',
          className,
        )}
      >
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(opt.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-brand text-white shadow-md'
                  : 'text-muted hover:text-foreground hover:bg-surface-2',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'flex bg-surface-0 border border-surface-2 rounded-lg p-0.5 shadow-sm',
        className,
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 py-1 text-xs font-semibold rounded-md transition',
              isActive
                ? 'bg-surface-1 text-foreground shadow-sm border border-surface-2'
                : 'text-muted hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
