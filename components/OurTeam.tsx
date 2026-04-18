'use client';

import { Star, Award, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

const team = [
  {
    name: 'Mr. Bilal Ghaffar',
    role: 'Residential Property Specialist',
    experience: '5 Years Experience',
    bio: 'Bilal brings 5 years of deep expertise in UAE residential properties — from luxury villas on the Palm to family-friendly apartments in JVC. He is known for his in-depth market knowledge and dedication to finding the perfect home for every client.',
    photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
    specialty: 'Residential Properties',
    specialtyIcon: '\u{1F3E0}',
    deals: '120+',
    rating: 4.9,
    phone: '+971 55 775 7123',
    email: 'info@bnhmasterkey.ae',
  },
  {
    name: 'Mr. Hamza Ghaffar',
    role: 'Commercial Property Specialist',
    experience: '4 Years Experience',
    bio: 'Hamza specialises in commercial real estate across the UAE, from Grade A office spaces in DIFC and Al Maryah Island to retail and industrial units. He helps businesses and investors secure the right commercial assets at the right value.',
    photo: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg',
    specialty: 'Commercial Properties',
    specialtyIcon: '\u{1F3E2}',
    deals: '85+',
    rating: 4.8,
    phone: '+971 55 775 7123',
    email: 'info@bnhmasterkey.ae',
  },
];

export default function OurTeam() {
  const { t, dir } = useLanguage();

  return (
    <section className="py-24 bg-[#ffffff] relative overflow-hidden" id="team" dir={dir}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A84C] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] font-body text-xs tracking-[0.25em] uppercase font-medium">
              {t('team.tagline')}
            </span>
            <div className="h-px w-10 bg-[#C9A84C]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray mb-4">{t('team.title')}</h2>
          <p className="font-body text-gray-400 text-lg max-w-2xl mx-auto">{t('team.description')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {team.map((member, i) => (
            <div key={member.name} className="group bg-black/5 border border-black/10 rounded-sm overflow-hidden backdrop-blur-sm hover:border-[#C9A84C]/30 transition-all duration-400 animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="flex gap-6 p-7 pb-5">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-sm overflow-hidden border-2 border-[#C9A84C]/40">
                    <img src={`${member.photo}?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face`} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#C9A84C] rounded-sm flex items-center justify-center">
                    <Award size={11} className="text-black" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-black text-xl font-bold mb-0.5">{member.name}</h3>
                  <p className="font-body text-[#C9A84C] text-sm font-medium mb-1">{member.role}</p>
                  <span className="inline-block bg-[#C9A84C]/15 text-[#C9A84C] text-xs font-body font-semibold px-2.5 py-1 rounded-sm border border-[#C9A84C]/20">{member.experience}</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={11} className={j < Math.round(member.rating) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-600 fill-gray-600'} />
                      ))}
                    </div>
                    <span className="font-body text-gray-500 text-xs">{member.rating} {t('team.rating')}</span>
                  </div>
                </div>
              </div>
              <div className="mx-7 h-px bg-white/8" />
              <div className="grid grid-cols-2 divide-x divide-white/8 mx-7 my-4">
                <div className="pr-4 text-center">
                  <p className="font-display text-2xl font-bold text-black">{member.deals}</p>
                  <p className="font-body text-gray-500 text-xs">{t('team.deals')}</p>
                </div>
                <div className="pl-4 text-center">
                  <p className="font-body text-lg font-bold text-black">{member.specialtyIcon}</p>
                  <p className="font-body text-gray-500 text-xs">{member.specialty}</p>
                </div>
              </div>
              <div className="mx-7 h-px bg-white/8" />
              <div className="px-7 py-5">
                <p className="font-body text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </div>
              <div className="px-7 pb-7 grid grid-cols-2 gap-3">
                <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8963f] text-black font-body text-sm font-semibold py-2.5 rounded-sm transition-colors">
                  <Phone size={14} /> {t('team.call')}
                </a>
                <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 border border-white/15 hover:border-[#C9A84C] text-darkgray-300 hover:text-[#C9A84C] font-body text-sm font-medium py-2.5 rounded-sm transition-all">
                  <Mail size={14} /> {t('team.email')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
