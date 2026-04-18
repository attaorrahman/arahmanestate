'use client';

import { useState, useRef } from 'react';
import { SlidersHorizontal, Grid3x3 as Grid3X3, List, ChevronDown } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton';
import type { Property, Emirate } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';

const PAGE_SIZE = 6;

interface Props {
  emirate: Emirate;
  initialProperties: Property[];
  slug: string;
}

interface Filters {
  priceType: string;
  propertyType: string;
  sort: string;
}

function applyFiltersToList(list: Property[], filters: Filters): Property[] {
  let result = [...list];

  if (filters.priceType !== 'all') {
    result = result.filter((p) => p.price_type === filters.priceType);
  }
  if (filters.propertyType !== 'all') {
    result = result.filter((p) => p.property_type === filters.propertyType);
  }

  if (filters.sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else {
    result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  return result;
}

export default function EmiratePropertiesClient({ emirate, initialProperties, slug }: Props) {
  const { t, dir } = useLanguage();
  const [filters, setFilters] = useState<Filters>({
    priceType: 'all',
    propertyType: 'all',
    sort: 'featured',
  });
  const [properties, setProperties] = useState<Property[]>(
    () => applyFiltersToList(initialProperties, { priceType: 'all', propertyType: 'all', sort: 'featured' })
  );
  const [displayed, setDisplayed] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateFilter = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setLoading(true);
    debounceTimer.current = setTimeout(() => {
      setProperties(applyFiltersToList(initialProperties, next));
      setDisplayed(PAGE_SIZE);
      setLoading(false);
    }, 150);
  };

  const visibleProps = properties.slice(0, displayed);
  const hasMore = displayed < properties.length;

  const selectClass = 'appearance-none bg-gray-50 border border-gray-200 rounded-sm pl-3 pr-8 py-2 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] cursor-pointer';

  return (
    <section className="py-12 bg-[#FAFAF8] min-h-[60vh]" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-5 bg-white rounded-sm border border-gray-100 luxury-shadow">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#C9A84C]" />
            <span className="font-body text-sm text-gray-600 font-medium">
              {properties.length} {t('props.found')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={filters.priceType}
                onChange={(e) => updateFilter('priceType', e.target.value)}
                className={selectClass}
              >
                <option value="all">{t('props.buy_rent')}</option>
                <option value="sale">{t('props.for_sale')}</option>
                <option value="rent">{t('props.for_rent')}</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filters.propertyType}
                onChange={(e) => updateFilter('propertyType', e.target.value)}
                className={selectClass}
              >
                <option value="all">{t('props.all_types')}</option>
                <option value="apartment">{t('props.apartment')}</option>
                <option value="villa">{t('props.villa')}</option>
                <option value="penthouse">{t('props.penthouse')}</option>
                <option value="townhouse">{t('props.townhouse')}</option>
                <option value="commercial">{t('props.commercial')}</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className={selectClass}
              >
                <option value="featured">{t('props.featured_first')}</option>
                <option value="price-asc">{t('props.price_low_high')}</option>
                <option value="price-desc">{t('props.price_high_low')}</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex border border-gray-200 rounded-sm overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 transition-colors ${view === 'grid' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-400 hover:text-gray-700'}`}
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 transition-colors ${view === 'list' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-400 hover:text-gray-700'}`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={`grid gap-8 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : visibleProps.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal size={24} className="text-gray-400" />
            </div>
            <h3 className="font-display text-xl text-gray-700 font-semibold mb-2">{t('props.no_properties')}</h3>
            <p className="font-body text-gray-400 text-sm">{t('props.adjust_filters')}</p>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-8 ${
                view === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 max-w-3xl'
              }`}
            >
              {visibleProps.map((property, i) => (
                <div
                  key={property.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(i % PAGE_SIZE) * 0.08}s` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setDisplayed((d) => d + PAGE_SIZE)}
                  className="inline-flex items-center gap-2.5 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-all duration-200 px-8 py-3.5 rounded-sm font-body text-sm font-medium"
                >
                  {t('props.load_more')}
                  <ChevronDown size={15} />
                </button>
                <p className="font-body text-gray-400 text-xs mt-3">
                  {t('props.showing')} {Math.min(displayed, properties.length)} {t('props.of')} {properties.length} {t('props.properties')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
