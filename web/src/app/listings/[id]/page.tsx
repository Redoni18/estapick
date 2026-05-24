import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ListingDetailView } from '@/components/listings/detail/ListingDetailView';
import {
  ListingNotFoundError,
  getListingById,
} from '@/lib/api/listings';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

async function loadListing(id: string) {
  try {
    return await getListingById(id, { cache: 'no-store' });
  } catch (err) {
    if (err instanceof ListingNotFoundError) {
      notFound();
    }
    throw err;
  }
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const listing = await getListingById(id, { cache: 'no-store' });
    return {
      title: listing.title,
      description: `${listing.title} — ${listing.city}. ${listing.bedrooms} bed · ${listing.bathrooms} bath · ${listing.area} m².`,
    };
  } catch {
    return { title: 'Listing not found' };
  }
}

export default async function ListingDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const listing = await loadListing(id);
  return <ListingDetailView listing={listing} />;
}
