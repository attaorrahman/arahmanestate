'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

const priceRanges = [
  { value: 'all' },
  { value: '0-1000000', en: 'Under AED 1M', ar: 'أقل من 1 مليون' },
  { value: '1000000-3000000', en: 'AED 1M – 3M', ar: '1 - 3 مليون' },
  { value: '3000000-7000000', en: 'AED 3M – 7M', ar: '3 - 7 مليون' },
  { value: '7000000-15000000', en: 'AED 7M – 15M', ar: '7 - 15 مليون' },
  { value: '15000000-999999999', en: 'Above AED 15M', ar: 'أكثر من 15 مليون' },
];

const bedroomOptions = [
  { value: 'any' },
  { value: '1', en: '1+ Bed', ar: '1+ غرفة' },
  { value: '2', en: '2+ Beds', ar: '2+ غرف' },
  { value: '3', en: '3+ Beds', ar: '3+ غرف' },
  { value: '4', en: '4+ Beds', ar: '4+ غرف' },
  { value: '5', en: '5+ Beds', ar: '5+ غرف' },
];

export default function SearchFilter() {
  const router = useRouter();
  const { lang, t, dir } = useLanguage();
  const [listingType, setListingType] = useState<'all' | 'sale' | 'rent'>('all');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [emirate, setEmirate] = useState('all');

  const emiratesOptions = [
    { value: 'all', label: t('search.all_emirates') },
    { value: 'dubai', label: lang === 'ar' ? 'دبي' : 'Dubai' },
    { value: 'abu-dhabi', label: lang === 'ar' ? 'أبوظبي' : 'Abu Dhabi' },
    { value: 'sharjah', label: lang === 'ar' ? 'الشارقة' : 'Sharjah' },
    { value: 'ajman', label: lang === 'ar' ? 'عجمان' : 'Ajman' },
    { value: 'ras-al-khaimah', label: lang === 'ar' ? 'رأس الخيمة' : 'Ras Al Khaimah' },
    { value: 'fujairah', label: lang === 'ar' ? 'الفجيرة' : 'Fujairah' },
    { value: 'umm-al-quwain', label: lang === 'ar' ? 'أم القيوين' : 'Umm Al Quwain' },
  ];

  const propertyTypes = [
    { value: 'all', label: t('search.all_types') },
    { value: 'apartment', label: t('search.apartment') },
    { value: 'villa', label: t('search.villa') },
    { value: 'penthouse', label: t('search.penthouse') },
    { value: 'townhouse', label: t('search.townhouse') },
    { value: 'commercial', label: t('search.commercial') },
  ];

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
    <section className="relative z-30 -mt-10 pb-8 px-4 sm:px-6 lg:px-8" id="search" dir={dir}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-sm luxury-shadow border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <SlidersHorizontal size={18} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-gray-900">{t('search.title')}</h2>
          </div>

          <div className="flex gap-1 mb-6 bg-gray-50 p-1 rounded-sm w-fit border border-gray-100">
            {(['all', 'sale', 'rent'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setListingType(type)}
                className={`px-5 py-2 text-sm font-body font-medium rounded-sm transition-all duration-200 capitalize ${
                  listingType === type ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {type === 'all' ? t('search.buy_rent') : type === 'sale' ? t('search.buy') : t('search.rent')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-body font-medium text-gray-500 uppercase tracking-wider mb-2">{t('search.emirates')}</label>
              <select value={emirate} onChange={(e) => setEmirate(e.target.value)} className="w-full border border-gray-200 rounded-sm px-3.5 py-3 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white transition-all">
                {emiratesOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-gray-500 uppercase tracking-wider mb-2">{t('search.property_type')}</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full border border-gray-200 rounded-sm px-3.5 py-3 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white transition-all">
                {propertyTypes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-gray-500 uppercase tracking-wider mb-2">{t('search.price_range')}</label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full border border-gray-200 rounded-sm px-3.5 py-3 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white transition-all">
                {priceRanges.map((o) => <option key={o.value} value={o.value}>{o.value === 'all' ? t('search.any_price') : o[lang]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-gray-500 uppercase tracking-wider mb-2">{t('search.bedrooms')}</label>
              <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full border border-gray-200 rounded-sm px-3.5 py-3 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] bg-white transition-all">
                {bedroomOptions.map((o) => <option key={o.value} value={o.value}>{o.value === 'any' ? t('search.any_beds') : o[lang]}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleSearch} className="btn-gold w-full flex items-center justify-center gap-2.5 py-3 rounded-sm font-body font-medium text-sm tracking-wide">
                <Search size={16} /> {t('search.button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
