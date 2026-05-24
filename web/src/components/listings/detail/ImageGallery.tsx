'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/format';

interface ImageGalleryProps {
  images: string[];
  title: string;
  city: string;
}

export function ImageGallery({ images, title, city }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const next = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative aspect-[16/10] bg-surface-1 rounded-2xl overflow-hidden border border-surface-2 shadow-sm group">
      {hasImages ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={images[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-faint bg-surface-1">
          <MapPin className="w-12 h-12" />
        </div>
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-0/70 border border-surface-2/40 text-muted hover:text-foreground flex items-center justify-center hover:bg-surface-1 transition opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-0/70 border border-surface-2/40 text-muted hover:text-foreground flex items-center justify-center hover:bg-surface-1 transition opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {hasImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-0/60 backdrop-blur-sm border border-surface-2/40 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'rounded-full transition-all duration-300 h-2',
                activeIndex === i
                  ? 'bg-brand w-4'
                  : 'bg-faint hover:bg-subtle w-2',
              )}
            />
          ))}
        </div>
      )}

      <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-surface-0/80 backdrop-blur-md border border-surface-2 text-xs font-bold text-foreground">
        {city}
      </div>
    </div>
  );
}
