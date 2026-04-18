'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, MapPin, Chrome as Home } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

const HERO_VIDEOS = ['/intVidoe1.mp4', '/intVideo2.mp4', '/extvedio2.mp4'];

export default function HeroSection() {
  const { t, dir } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload the next video so there's no gap/flash between transitions
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % HERO_VIDEOS.length;
    if (nextVideoRef.current) {
      nextVideoRef.current.src = HERO_VIDEOS[nextIndex];
      nextVideoRef.current.load();
    }
  }, [currentIndex]);

  const handleVideoEnd = useCallback(() => {
    const nextIndex = (currentIndex + 1) % HERO_VIDEOS.length;
    setCurrentIndex(nextIndex);
    if (videoRef.current) {
      videoRef.current.src = HERO_VIDEOS[nextIndex];
      videoRef.current.play();
    }
  }, [currentIndex]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" dir={dir}>
      {/* Video background */}
      <div className="absolute inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover object-center"
          src={HERO_VIDEOS[0]}
        />
        {/* Hidden preload video */}
        <video
          ref={nextVideoRef}
          muted
          playsInline
          preload="auto"
          className="hidden"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/40" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold font-body text-xs tracking-[0.25em] uppercase font-medium">
              {t('hero.tagline')}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white font-bold leading-[1.08] mb-6 animate-fade-in-up">
            {t('hero.title1')}
            <br />
            <span className="italic text-gold">{t('hero.title2')}</span>
            {' '}
            <span className="text-white">{t('hero.title3')}</span>
          </h1>

          <p className="font-body text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl animate-fade-in-up delay-200">
            {t('hero.description')}
          </p>

          <div className="flex flex-wrap gap-4 mb-16 animate-fade-in-up delay-300">
            <Link
              href="#featured"
              className="btn-gold inline-flex items-center gap-2.5 px-7 py-4 rounded-sm font-body font-medium text-sm tracking-wide"
            >
              {t('hero.explore')}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#contact"
              className="btn-outline-white inline-flex items-center gap-2.5 px-7 py-4 rounded-sm font-body font-medium text-sm tracking-wide"
            >
              {t('hero.contact_agent')}
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 animate-fade-in-up delay-400">
            {[
              { icon: Home, value: '109+', label: t('hero.properties_listed') },
              { icon: MapPin, value: '7', label: t('hero.emirates_covered') },
              { icon: TrendingUp, value: '98%', label: t('hero.client_satisfaction') },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Icon size={16} className="text-gold" />
                </div>
                <div>
                  <p className="font-display text-white text-xl font-bold">{value}</p>
                  <p className="font-body text-gray-400 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
