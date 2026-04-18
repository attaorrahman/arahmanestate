import { getFeaturedProperties } from '@/lib/queries';
import type { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import FeaturedPropertiesHeader from './FeaturedPropertiesHeader';

export default async function FeaturedProperties() {
  let properties: Property[] = [];
  try {
    properties = await getFeaturedProperties();
  } catch {
    properties = [];
  }

  return (
    <section className="py-24 bg-[#FAFAF8]" id="featured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedPropertiesHeader />

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property, i) => (
              <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
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
