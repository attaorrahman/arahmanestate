'use client';

import { ShieldCheck, BadgeDollarSign, Star, Headphones, Award, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function WhyChooseUs() {
  const { t, dir } = useLanguage();

  const features = [
    { icon: ShieldCheck, title: t('why.trusted_agents'), desc: t('why.trusted_agents_desc') },
    { icon: BadgeDollarSign, title: t('why.best_price'), desc: t('why.best_price_desc') },
    { icon: Star, title: t('why.verified'), desc: t('why.verified_desc') },
    { icon: Headphones, title: t('why.support'), desc: t('why.support_desc') },
    { icon: Award, title: t('why.award'), desc: t('why.award_desc') },
    { icon: Clock, title: t('why.fast'), desc: t('why.fast_desc') },
  ];

  return (
    <section className="py-24 bg-[#0D0D0D] relative overflow-hidden" id="about" dir={dir}>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] font-body text-xs tracking-[0.25em] uppercase font-medium">{t('why.tagline')}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              {t('why.title1')}
              <span className="block italic text-[#C9A84C]">{t('why.title2')}</span>
            </h2>
            <p className="font-body text-gray-400 text-lg leading-relaxed">{t('why.description')}</p>
          </div>
          <div className="hidden lg:block relative h-80">
            <img src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600&q=70" alt="Luxury Property" className="w-full h-full object-cover rounded-sm" />
            <div className="absolute -bottom-6 -left-6 bg-[#C9A84C] p-5 rounded-sm">
              <p className="font-display text-white text-3xl font-bold">10+</p>
              <p className="font-body text-white/80 text-sm">{t('why.years')}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="group p-6 border border-white/8 rounded-sm hover:border-[#C9A84C]/40 transition-all duration-300 hover:bg-white/3 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-sm bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-4 group-hover:bg-[#C9A84C]/20 transition-colors">
                <Icon size={20} className="text-[#C9A84C]" />
              </div>
              <h3 className="font-display text-white text-lg font-semibold mb-2 group-hover:text-[#E8D5A3] transition-colors">{title}</h3>
              <p className="font-body text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
