interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
}: ErrorStateProps) {
  return (
    <div className="p-6 rounded-xl border border-red-900/40 bg-red-950/20 text-center space-y-2">
      <p className="text-red-400 text-xs font-semibold">{title}</p>
      <p className="text-muted text-2xs">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1 bg-red-900/40 border border-red-700/30 rounded text-2xs hover:bg-red-900/60 transition mt-2"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
