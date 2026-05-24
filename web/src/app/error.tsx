'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center gap-4 text-center p-6">
      <div className="w-16 h-16 rounded-full bg-red-950/40 flex items-center justify-center text-red-400 border border-red-900/40">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Something went wrong</h2>
        <p className="text-xs text-subtle max-w-xs mt-1">
          {error.message || 'An unexpected error occurred while loading the listings.'}
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-md transition"
      >
        <RefreshCcw className="w-3.5 h-3.5" />
        Try Again
      </button>
    </div>
  );
}
