'use client';

import { useLanguage } from '@/lib/language-context';

export default function AllPropertiesHeader() {
  const { t, dir } = useLanguage();

  return (
    <div className="absolute inset-0 flex items-end" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-[#C9A84C]" />
          <span className="font-body text-[#C9A84C] text-xs tracking-[0.2em] uppercase">
            {t('props.all_emirates')}
          </span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl text-white font-bold mb-2">
          {t('props.all_properties')}
        </h1>
        <p className="font-body text-gray-300 text-lg max-w-2xl">
          {t('props.explore_full')}
        </p>
      </div>
    </div>
  );
}
