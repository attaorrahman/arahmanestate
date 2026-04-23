'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function EmiratesSectionHeader() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t, dir } = useLanguage();

  const handleViewAll = () => {
    startTransition(() => {
      router.push('/properties/dubai');
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6" dir={dir}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] font-body text-xs tracking-[0.25em] uppercase font-medium">
            {t('emirates.tagline')}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          {t('emirates.title')}
        </h2>
        <p className="font-body text-gray-500 text-lg max-w-lg">
          {t('emirates.description')}
        </p>
      </div>
      <button
        onClick={handleViewAll}
        disabled={isPending}
        className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-sm font-body text-sm font-medium whitespace-nowrap shrink-0 disabled:opacity-50"
      >
        {t('emirates.view_all')}
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
