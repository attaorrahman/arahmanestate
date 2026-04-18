'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import type { Emirate } from '@/lib/types';

const highlightKeys: Record<string, { taglineKey: string; highlightKey: string }> = {
  dubai:            { taglineKey: 'emirates.tagline_dubai',    highlightKey: 'emirates.highlight_most_popular' },
  'abu-dhabi':      { taglineKey: 'emirates.tagline_abu_dhabi', highlightKey: 'emirates.highlight_top_investment' },
  sharjah:          { taglineKey: 'emirates.tagline_sharjah',  highlightKey: 'emirates.highlight_best_value' },
  ajman:            { taglineKey: 'emirates.tagline_ajman',    highlightKey: 'emirates.highlight_waterfront' },
  'ras-al-khaimah': { taglineKey: 'emirates.tagline_rak',      highlightKey: 'emirates.highlight_nature_sea' },
  fujairah:         { taglineKey: 'emirates.tagline_fujairah', highlightKey: 'emirates.highlight_hidden_gem' },
  'umm-al-quwain':  { taglineKey: 'emirates.tagline_uaq',      highlightKey: 'emirates.highlight_peaceful' },
};

interface Props {
  emirates: Emirate[];
}

export default function EmiratesSectionCards({ emirates }: Props) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {emirates.map((emirate, i) => {
        const keys = highlightKeys[emirate.slug] ?? {
          taglineKey: 'emirates.tagline_default',
          highlightKey: 'emirates.highlight_explore',
        };
        return (
          <Link
            key={emirate.id}
            href={`/properties/${emirate.slug}`}
            className="group relative bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up flex flex-col"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img
                src={`${emirate.image_url}?auto=compress&cs=tinysrgb&w=500&q=75`}
                alt={emirate.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="bg-[#C9A84C] text-black text-[10px] font-body font-bold px-2.5 py-1 rounded-sm tracking-wide uppercase">
                  {t(keys.highlightKey)}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-body px-2.5 py-1 rounded-sm border border-white/15">
                  {emirate.property_count} {t('emirates.listings')}
                </span>
              </div>

              <div className="absolute bottom-3 left-4">
                <h3 className="font-display text-white text-xl font-bold group-hover:text-[#E8D5A3] transition-colors">
                  {emirate.name}
                </h3>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <p className="font-body text-gray-500 text-sm mb-4 flex-1">
                {t(keys.taglineKey)}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-body">
                  <MapPin size={12} className="text-[#C9A84C]" />
                  UAE
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-body">
                  <Building2 size={12} className="text-[#C9A84C]" />
                  {emirate.property_count} {t('emirates.properties')}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="font-body text-[#C9A84C] text-sm font-medium">
                  {t('emirates.browse')}
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
  );
}
