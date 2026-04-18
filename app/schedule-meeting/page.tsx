export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import MeetingScheduler from './MeetingScheduler';
import MeetingPageHeader from './MeetingPageHeader';

export const metadata: Metadata = {
  title: 'Schedule a Meeting — BNH MasterKey',
  description: 'Book a time to meet with our property advisors. Choose a date and available slot.',
};

export default function ScheduleMeetingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <MeetingPageHeader />
          <MeetingScheduler />
        </div>
      </section>

      <Footer />
      <FloatingContactButtons />
    </main>
  );
}
