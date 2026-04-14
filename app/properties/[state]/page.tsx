import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmiratePropertiesClient from './EmiratePropertiesClient';
import { getEmirateBySlug, getPropertiesByEmirate } from '@/lib/queries';

interface Props {
  params: { state: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const emirate = await getEmirateBySlug(params.state).catch(() => null);
  if (!emirate) return { title: 'Properties — BNH MasterKey' };
  return {
    title: `Properties in ${emirate.name} — BNH MasterKey`,
    description: `Discover luxury properties in ${emirate.name}. Villas, apartments, penthouses and more. ${emirate.description}`,
  };
}

export default async function EmiratePage({ params }: Props) {
  const [emirate, properties] = await Promise.all([
    getEmirateBySlug(params.state).catch(() => null),
    getPropertiesByEmirate(params.state).catch(() => []),
  ]);

  if (!emirate) notFound();

  return (
    <main>
      <Navbar />
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={`${emirate.image_url}?auto=compress&cs=tinysrgb&w=1920&q=75`}
          alt={emirate.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#C9A84C]" />
              <span className="font-body text-[#C9A84C] text-xs tracking-[0.2em] uppercase">UAE Emirates</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl text-white font-bold mb-2">
              Properties in {emirate.name}
            </h1>
            <p className="font-body text-gray-300 text-lg max-w-2xl">
              {emirate.description}
            </p>
          </div>
        </div>
      </div>

      <EmiratePropertiesClient
        emirate={emirate}
        initialProperties={properties}
        slug={params.state}
      />

      <Footer />
    </main>
  );
}
