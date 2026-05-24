import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface DetailTopbarProps {
  title: string;
  city: string;
}

export function DetailTopbar({ title, city }: DetailTopbarProps) {
  return (
    <nav className="sticky top-0 z-[1000] shrink-0 border-b border-surface-2 bg-surface-1/95 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 sm:py-4 flex items-center gap-4">
      <Link
        href="/listings"
        aria-label="Back to listings"
        className="p-2 rounded-lg bg-surface-1 border border-surface-2 hover:bg-surface-2 text-muted hover:text-foreground transition flex items-center justify-center"
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>
      <div className="min-w-0 flex-1">
        <h1 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
          {title}
        </h1>
        <p className="text-3xs text-subtle">{city} Real Estate Listing</p>
      </div>
      <ThemeToggle />
    </nav>
  );
}
