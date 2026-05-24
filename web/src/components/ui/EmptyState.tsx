import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      {icon && (
        <div className="p-3 bg-surface-1/60 rounded-full border border-surface-2">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-xs text-foreground">{title}</h3>
        {description && (
          <p className="text-2xs text-subtle max-w-[240px] mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
