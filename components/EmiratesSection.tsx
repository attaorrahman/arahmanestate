import { getEmiratesWithCounts } from '@/lib/queries';
import type { Emirate } from '@/lib/types';
import EmiratesSectionHeader from './EmiratesSectionHeader';
import EmiratesSectionCards from './EmiratesSectionCards';

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
        <EmiratesSectionHeader />
        <EmiratesSectionCards emirates={emirates} />
      </div>
    </section>
  );
}
