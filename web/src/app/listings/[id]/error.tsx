'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ListingDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center gap-4 text-center p-6">
      <div className="w-16 h-16 rounded-full bg-red-950/40 flex items-center justify-center text-red-400 border border-red-900/40">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">
          We couldn&apos;t load this listing
        </h2>
        <p className="text-xs text-subtle max-w-xs mt-1">
          {error.message || 'An unexpected error occurred while loading the property.'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-md transition"
        >
          Try Again
        </button>
        <Link
          href="/listings"
          className="px-4 py-2 bg-surface-1 border border-surface-2 hover:bg-surface-2 text-foreground text-xs font-semibold rounded-xl transition"
        >
          Back to Listings
        </Link>
      </div>
    </div>
  );
}
