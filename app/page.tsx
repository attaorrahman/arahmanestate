export const dynamic = 'force-dynamic';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SearchFilter from '@/components/SearchFilter';
import TrustedPartners from '@/components/TrustedPartners';
import FeaturedProperties from '@/components/FeaturedProperties';
import EmiratesSection from '@/components/EmiratesSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import StatsCounter from '@/components/StatsCounter';
import OurTeam from '@/components/OurTeam';
import Testimonials from '@/components/Testimonials';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import FloatingContactButtons from '@/components/FloatingContactButtons';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SearchFilter />
      <FeaturedProperties />
      <EmiratesSection />
      <WhyChooseUs />
      <TrustedPartners />
      <StatsCounter />
      <OurTeam />
      <Testimonials />
      <ContactForm />
      <Footer />
      <FloatingContactButtons />
    </main>
  );
}
