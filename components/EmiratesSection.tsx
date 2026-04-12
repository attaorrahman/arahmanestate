import Link from 'next/link';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';
import { getEmiratesWithCounts } from '@/lib/queries';
import type { Emirate } from '@/lib/types';

const emirateHighlights: Record<string, { tagline: string; highlight: string }> = {
  dubai:          { tagline: 'Iconic skyline & waterfront living',   highlight: 'Most Popular' },
  'abu-dhabi':    { tagline: 'Capital luxury & cultural heritage',   highlight: 'Top Investment' },
  sharjah:        { tagline: 'Affordable luxury & family life',       highlight: 'Best Value' },
  ajman:          { tagline: 'Coastal charm on the Arabian Gulf',    highlight: 'Waterfront' },
  'ras-al-khaimah': { tagline: 'Mountains, beaches & resort life',   highlight: 'Nature & Sea' },
  fujairah:       { tagline: 'East coast serenity & diving haven',   highlight: 'Hidden Gem' },
  'umm-al-quwain':  { tagline: 'Tranquil marina & waterfront villas', highlight: 'Peaceful' },
};

export default async function EmiratesSection() {
  let emirates: Emirate[] = [];
  try {
    emirates = await getEmiratesWithCounts();
  } catch {
    emirates = [];
  }

  return (
    <section className="py-24 bg-[#F8F7F4]" id="emirates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] font-body text-xs tracking-[0.25em] uppercase font-medium">
                UAE Emirates
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Explore by City
            </h2>
            <p className="font-body text-gray-500 text-lg max-w-lg">
              Each of the UAE seven Emirates offers a unique lifestyle. Find your perfect address.
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

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {emirates.map((emirate, i) => {
            const meta = emirateHighlights[emirate.slug] ?? {
              tagline: 'Discover luxury living',
              highlight: 'Explore',
            };
            return (
              <Link
                key={emirate.id}
                href={`/properties/${emirate.slug}`}
                className="group relative bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up flex flex-col"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={`${emirate.image_url}?auto=compress&cs=tinysrgb&w=500&q=75`}
                    alt={emirate.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Highlight badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#C9A84C] text-black text-[10px] font-body font-bold px-2.5 py-1 rounded-sm tracking-wide uppercase">
                      {meta.highlight}
                    </span>
                  </div>

                  {/* Property count badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-body px-2.5 py-1 rounded-sm border border-white/15">
                      {emirate.property_count} listings
                    </span>
                  </div>

                  {/* Emirate name on image */}
                  <div className="absolute bottom-3 left-4">
                    <h3 className="font-display text-white text-xl font-bold group-hover:text-[#E8D5A3] transition-colors">
                      {emirate.name}
                    </h3>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="font-body text-gray-500 text-sm mb-4 flex-1">
                    {meta.tagline}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-body">
                      <MapPin size={12} className="text-[#C9A84C]" />
                      UAE
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-body">
                      <Building2 size={12} className="text-[#C9A84C]" />
                      {emirate.property_count} Properties
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="font-body text-[#C9A84C] text-sm font-medium">
                      Browse Properties
                    </span>
                    <div className="w-7 h-7 rounded-sm bg-[#C9A84C]/10 flex items-center justify-center group-hover:bg-[#C9A84C] transition-colors duration-300">
                      <ArrowRight size={13} className="text-[#C9A84C] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
