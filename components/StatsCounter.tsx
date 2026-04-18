'use client';

import { useEffect, useRef, useState } from 'react';
import { Building2, Users, MapPin, UserCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

function useCounter(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); } else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function StatItem({ icon: Icon, value, suffix, label, started }: { icon: typeof Building2; value: number; suffix: string; label: string; started: boolean }) {
  const count = useCounter(value, 2000, started);
  return (
    <div className="text-center group">
      <div className="w-16 h-16 rounded-sm bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#C9A84C]/20 transition-colors">
        <Icon size={26} className="text-[#C9A84C]" />
      </div>
      <p className="font-display text-5xl font-bold text-[#1A1A1A] mb-2">{count.toLocaleString()}<span className="text-[#C9A84C]">{suffix}</span></p>
      <p className="font-body text-gray-500 text-sm tracking-wide">{label}</p>
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const { t, dir } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Building2, value: 109, suffix: '+', label: t('stats.properties') },
    { icon: Users, value: 2400, suffix: '+', label: t('stats.clients') },
    { icon: MapPin, value: 7, suffix: '', label: t('stats.emirates') },
    { icon: UserCheck, value: 85, suffix: '+', label: t('stats.agents') },
  ];

  return (
    <section className="py-20 bg-[#F5F0E8]" ref={ref} dir={dir}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-body text-[#C9A84C] text-xs tracking-[0.25em] uppercase font-medium mb-2">{t('stats.tagline')}</p>
          <h2 className="font-display text-4xl font-bold text-gray-900">{t('stats.title')}</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => <StatItem key={stat.label} {...stat} started={started} />)}
        </div>
      </div>
    </section>
  );
}
