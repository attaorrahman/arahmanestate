'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

const testimonials = [
  {
    name: 'Ahmed Al Mansouri',
    role: 'Real Estate Investor',
    location: 'Dubai',
    rating: 5,
    text: 'BNH MasterKey made finding my dream villa on Palm Jumeirah an extraordinary experience. Their agents understood my vision perfectly and guided me through every step with unmatched professionalism.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Sarah Thompson',
    role: 'Expatriate Homeowner',
    location: 'Abu Dhabi',
    rating: 5,
    text: 'As a first-time buyer in the UAE, I was nervous about the process. BNH MasterKey\'s team was patient, transparent, and incredibly knowledgeable. I found the perfect Corniche apartment within weeks.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Khalid Al Rashidi',
    role: 'Business Executive',
    location: 'Sharjah',
    rating: 5,
    text: 'The attention to detail and the quality of properties listed on BNH MasterKey is unparalleled. I found my family villa through them and the entire experience was seamless from start to finish.',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Elena Petrov',
    role: 'Portfolio Investor',
    location: 'Dubai',
    rating: 5,
    text: 'I\'ve worked with many real estate companies across the world — BNH MasterKey stands out for their market insights, verified listings, and the caliber of properties they represent. Truly exceptional.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { t, dir } = useLanguage();

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const visible = [
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
  ];

  return (
    <section className="py-24 bg-[#FAFAF8] overflow-hidden" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] font-body text-xs tracking-[0.25em] uppercase font-medium">
                {t('testimonials.tagline')}
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900">
              {t('testimonials.title')}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-sm bg-[#C9A84C] flex items-center justify-center text-white hover:bg-[#A67C00] transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visible.map((t, i) => (
            <div
              key={`${current}-${i}`}
              className={`p-8 rounded-sm border border-gray-100 luxury-shadow bg-white animate-scale-in`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Quote size={32} className="text-[#C9A84C]/20 mb-4" />
              <p className="font-body text-gray-600 text-base leading-relaxed mb-8 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-display text-gray-900 font-semibold">{t.name}</p>
                  <p className="font-body text-gray-400 text-sm">
                    {t.role} · {t.location}
                  </p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#C9A84C] fill-[#C9A84C]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-8 justify-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-[#C9A84C]' : 'w-3 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
