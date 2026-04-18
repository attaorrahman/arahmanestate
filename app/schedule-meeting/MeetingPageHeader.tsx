'use client';

import { useLanguage } from '@/lib/language-context';

export default function MeetingPageHeader() {
  const { t, dir } = useLanguage();

  return (
    <div className="mb-10 text-center" dir={dir}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-10 bg-[#C9A84C]" />
        <span className="text-[#C9A84C] font-body text-xs tracking-[0.25em] uppercase font-medium">
          {t('meeting.tagline')}
        </span>
        <div className="h-px w-10 bg-[#C9A84C]" />
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
        {t('meeting.title')}
      </h1>
      <p className="font-body text-gray-500 text-base max-w-xl mx-auto">
        {t('meeting.description')}
      </p>
    </div>
  );
}
