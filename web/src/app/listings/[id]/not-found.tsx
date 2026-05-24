import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center gap-4 text-center p-6">
      <div className="w-16 h-16 rounded-full bg-surface-1 flex items-center justify-center text-subtle border border-surface-2">
        <MapPin className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Listing Not Found</h2>
        <p className="text-xs text-subtle max-w-xs mt-1">
          The property you are looking for does not exist or has been removed.
        </p>
      </div>
      <Link
        href="/listings"
        className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-md transition"
      >
        Back to Listings
      </Link>
    </div>
  );
}
