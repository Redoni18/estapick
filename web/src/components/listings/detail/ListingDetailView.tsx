import { DetailTopbar } from './DetailTopbar';
import { ImageGallery } from './ImageGallery';
import { PropertyHeader } from './PropertyHeader';
import { PropertyStats } from './PropertyStats';
import { PropertyMeta } from './PropertyMeta';
import { LocationPanel } from './LocationPanel';
import { ContactForm } from './ContactForm';
import type { Listing } from '@/types/listing';

interface ListingDetailViewProps {
  listing: Listing;
}

export function ListingDetailView({ listing }: ListingDetailViewProps) {
  return (
    <div className="min-h-screen bg-surface-0 text-foreground flex flex-col">
      <DetailTopbar title={listing.title} city={listing.city} />

      <main className="relative z-0 flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 space-y-6">
          <ImageGallery
            images={listing.images}
            title={listing.title}
            city={listing.city}
          />

          <div className="glass rounded-2xl p-6 space-y-6">
            <PropertyHeader
              title={listing.title}
              city={listing.city}
              price={listing.price}
            />

            <PropertyStats
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              area={listing.area}
            />

            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider font-bold text-muted">
                About this Property
              </h3>
              <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <PropertyMeta
              createdAt={listing.createdAt}
              latitude={listing.latitude}
              longitude={listing.longitude}
            />
          </div>
        </section>

        <section className="lg:col-span-5 space-y-6">
          <LocationPanel
            latitude={listing.latitude}
            longitude={listing.longitude}
            title={listing.title}
            price={listing.price}
            city={listing.city}
            bedrooms={listing.bedrooms}
            area={listing.area}
            image={listing.images?.[0]}
          />
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
