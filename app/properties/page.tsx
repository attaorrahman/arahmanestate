export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllProperties, getEmiratesWithCounts } from '@/lib/queries';
import AllPropertiesClient from './AllPropertiesClient';
import AllPropertiesHeader from './AllPropertiesHeader';

export const metadata: Metadata = {
  title: 'All Properties — BNH MasterKey',
  description: 'Browse luxury villas, apartments, penthouses, and more across all UAE emirates.',
};

export default async function AllPropertiesPage() {
  const [properties, emirates] = await Promise.all([
    getAllProperties(),
    getEmiratesWithCounts(),
  ]);

  return (
    <main>
      <Navbar />

      <div className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1920&q=75"
          src="/Intvideo4.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <AllPropertiesHeader />
      </div>

      <AllPropertiesClient initialProperties={properties} emirates={emirates} />

      <Footer />
    </main>
  );
}
