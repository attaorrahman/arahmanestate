'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';

const emiratesOptions = [
  { value: 'all', label: 'All Emirates' },
  { value: 'dubai', label: 'Dubai' },
  { value: 'abu-dhabi', label: 'Abu Dhabi' },
  { value: 'sharjah', label: 'Sharjah' },
  { value: 'ajman', label: 'Ajman' },
  { value: 'ras-al-khaimah', label: 'Ras Al Khaimah' },
  { value: 'fujairah', label: 'Fujairah' },
  { value: 'umm-al-quwain', label: 'Umm Al Quwain' },
];

const propertyTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial' },
];

const priceRanges = [
  { value: 'all', label: 'Any Price' },
  { value: '0-1000000', label: 'Under AED 1M' },
  { value: '1000000-3000000', label: 'AED 1M – 3M' },
  { value: '3000000-7000000', label: 'AED 3M – 7M' },
  { value: '7000000-15000000', label: 'AED 7M – 15M' },
  { value: '15000000-999999999', label: 'Above AED 15M' },
];

const bedroomOptions = [
  { value: 'any', label: 'Any Beds' },
  { value: '1', label: '1+ Bed' },
  { value: '2', label: '2+ Beds' },
  { value: '3', label: '3+ Beds' },
  { value: '4', label: '4+ Beds' },
  { value: '5', label: '5+ Beds' },
];

export default function SearchFilter() {
  const router = useRouter();
  const [listingType, setListingType] = useState<'all' | 'sale' | 'rent'>('all');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [emirate, setEmirate] = useState('all');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (listingType !== 'all') params.set('type', listingType);
    if (propertyType !== 'all') params.set('propertyType', propertyType);
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-');
      params.set('minPrice', min);
      params.set('maxPrice', max);
    }
    if (bedrooms !== 'any') params.set('beds', bedrooms);

    const slug = emirate === 'all' ? 'dubai' : emirate;
    router.push(`/properties/${slug}?${params.toString()}`);
  };

  return (
    <section className="relative z-30 -mt-10 pb-8 px-4 sm:px-6 lg:px-8" id="search">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-sm luxury-shadow border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <SlidersHorizontal size={18} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-gray-900">
              Search Properties
            </h2>
          </div>

          <div className="flex gap-1 mb-6 bg-gray-50 p-1 rounded-sm w-fit border border-gray-100">
            {(['all', 'sale', 'rent'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setListingType(type)}
                className={`px-5 py-2 text-sm font-body font-medium rounded-sm transition-all duration-200 capitalize ${
                  listingType === type
                    ? 'bg-[#1A1A1A] text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {type === 'all' ? 'Buy / Rent' : type === 'sale' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-xs font-body font-medium text-gray-500 uppercase tracking-wider mb-2">
                Emirates
              </label>
              <select
                value={emirate}
                onChange={(e) => setEmirate(e.target.value)}
                className="w-full border border-gray-200 rounded-sm px-3.5 py-3 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white transition-all"
              >
                {emiratesOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-body font-medium text-gray-500 uppercase tracking-wider mb-2">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full border border-gray-200 rounded-sm px-3.5 py-3 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white transition-all"
              >
                {propertyTypes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-body font-medium text-gray-500 uppercase tracking-wider mb-2">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full border border-gray-200 rounded-sm px-3.5 py-3 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white transition-all"
              >
                {priceRanges.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-xs font-body font-medium text-gray-500 uppercase tracking-wider mb-2">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full border border-gray-200 rounded-sm px-3.5 py-3 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white transition-all"
              >
                {bedroomOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-1 flex items-end">
              <button
                onClick={handleSearch}
                className="btn-gold w-full flex items-center justify-center gap-2.5 py-3 rounded-sm font-body font-medium text-sm tracking-wide"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
