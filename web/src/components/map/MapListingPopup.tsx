import Link from 'next/link';
import { Home } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface MapListingPopupProps {
  title: string;
  price: number;
  city?: string;
  bedrooms?: number;
  area?: number;
  image?: string;
  href?: string;
}

export function MapListingPopup({
  title,
  price,
  city,
  bedrooms,
  area,
  image,
  href,
}: MapListingPopupProps) {
  const meta =
    city != null && bedrooms != null && area != null
      ? `${city} · ${bedrooms} ${bedrooms === 1 ? 'Bed' : 'Beds'} · ${area} m²`
      : city;

  const content = (
    <>
      <div className="relative w-full h-[132px] bg-surface-2 overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover${href ? ' transition-transform duration-300 group-hover:scale-105' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-faint">
            <Home className="w-8 h-8" />
          </div>
        )}
      </div>
      <div className="px-3 pt-2.5 pb-3">
        <h3
          className={`font-semibold text-sm text-foreground line-clamp-2 leading-snug${href ? ' group-hover:text-brand transition-colors' : ''}`}
        >
          {title}
        </h3>
        {meta && <p className="text-2xs text-muted mt-1">{meta}</p>}
        <p className="text-sm font-bold text-brand mt-1.5">{formatPrice(price)}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block w-[240px] no-underline group">
        {content}
      </Link>
    );
  }

  return <div className="block w-[240px]">{content}</div>;
}
