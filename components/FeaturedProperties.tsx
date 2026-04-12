import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProperties } from '@/lib/queries';
import type { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from './PropertyCardSkeleton';

export default async function FeaturedProperties() {
  let properties: Property[] = [];
  let errorMsg = '';
  try {
    properties = await getFeaturedProperties();
  } catch (e: unknown) {
    if (e instanceof Error) {
      errorMsg = e.message;
    } else if (e && typeof e === 'object' && 'message' in e) {
      errorMsg = String((e as { message: unknown }).message);
    } else {
      errorMsg = JSON.stringify(e);
    }
    properties = [];
  }

  return (
    <section className="py-24 bg-[#FAFAF8]" id="featured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] font-body text-xs tracking-[0.25em] uppercase font-medium">
                Curated Selection
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Featured Properties
            </h2>
            <p className="font-body text-gray-500 text-lg max-w-lg">
              Handpicked luxury properties across the UAE for the most discerning buyers.
            </p>
          </div>
          <Link
            href="/properties/dubai"
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-sm font-body text-sm font-medium whitespace-nowrap shrink-0"
          >
            View All Properties
            <ArrowRight size={15} />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property, i) => (
              <div
                key={property.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <PropertyCard property={property} priority={i < 4} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
