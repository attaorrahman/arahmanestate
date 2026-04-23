'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Bed, Bath, Square, MapPin, Heart, CircleCheck as CheckCircle2, ArrowUpRight } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';

interface Props {
  property: Property;
  priority?: boolean;
}

export default function PropertyCard({ property, priority = false }: Props) {
  const [liked, setLiked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useLanguage();

  const handleViewDetails = () => {
    startTransition(() => {
      router.push(`/property/${property.id}`);
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 bg-white/30 z-[9997] pointer-events-none" />
      )}
      <div className="card-hover bg-white rounded-sm overflow-hidden border border-gray-100 group">
        <button onClick={handleViewDetails} disabled={isPending} className="block w-full text-left disabled:opacity-50">
          <div className="relative image-zoom aspect-[4/3] bg-gray-100">
          <img
            src={
              property.image_url
                ? property.image_url.includes('images.pexels.com')
                  ? `${property.image_url}?auto=compress&cs=tinysrgb&w=600&q=75`
                  : property.image_url
                : '/logo.jpeg'
            }
            alt={property.title}
            className="w-full h-full object-cover"
            loading={priority ? 'eager' : 'lazy'}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`font-body text-xs font-semibold px-2.5 py-1 rounded-sm tracking-wide ${
              property.price_type === 'sale'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#C9A84C] text-white'
            }`}>
              {property.price_type === 'sale' ? t('card.for_sale') : t('card.for_rent')}
            </span>
            {property.is_featured && (
              <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-sm tracking-wide bg-white text-[#C9A84C] border border-[#C9A84C]/30">
                {t('card.featured')}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
              className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-200 ${
                liked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {property.is_verified && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-sm px-2 py-1">
                <CheckCircle2 size={11} className="text-green-500" />
                <span className="font-body text-xs text-green-700 font-medium">{t('card.verified')}</span>
              </div>
            </div>
          )}
          </div>
        </button>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <p className="font-display text-[#C9A84C] text-2xl font-bold">
              {formatPrice(property.price, property.price_type)}
              {property.price_type === 'rent' && (
                <span className="text-gray-400 text-sm font-body font-normal">{t('card.yr')}</span>
              )}
            </p>
            <span className="text-xs font-body text-gray-400 bg-gray-50 px-2 py-1 rounded-sm capitalize border border-gray-100">
              {property.property_type}
            </span>
          </div>

          <button onClick={handleViewDetails} disabled={isPending} className="group/title text-left w-full disabled:opacity-50">
            <h3 className="font-display text-gray-900 text-lg font-semibold leading-snug mb-2 line-clamp-2 group-hover/title:text-[#C9A84C] transition-colors">
              {property.title}
            </h3>
          </button>

        <div className="flex items-center gap-1.5 mb-4">
          <MapPin size={13} className="text-[#C9A84C] shrink-0" />
          <span className="font-body text-gray-500 text-sm truncate">{property.location}</span>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
          {property.bedrooms !== null && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <Bed size={14} />
              <span className="font-body text-sm">{property.bedrooms} {t('card.beds')}</span>
            </div>
          )}
          {property.bathrooms !== null && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <Bath size={14} />
              <span className="font-body text-sm">{property.bathrooms} {t('card.baths')}</span>
            </div>
          )}
          {property.sqft !== null && (
            <div className="flex items-center gap-1.5 text-gray-500 ml-auto">
              <Square size={14} />
              <span className="font-body text-sm">{property.sqft.toLocaleString()} {t('card.sqft')}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleViewDetails}
          disabled={isPending}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-all duration-200 py-2.5 rounded-sm font-body text-sm font-medium group/btn disabled:opacity-50"
        >
          {t('card.view_details')}
          <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
        </div>
      </div>
    </>
  );
}
