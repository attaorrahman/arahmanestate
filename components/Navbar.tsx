'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { lang, toggle, t } = useLanguage();

  const navLinks = [
    { label: t('nav.home'), href: '/#hero' },
    { label: t('nav.properties'), href: '/properties' },
    { label: t('nav.transactions'), href: '/transactions' },
    { label: t('nav.emirates'), href: '/#emirates' },
    { label: t('nav.team'), href: '/#team' },
    { label: t('nav.meeting'), href: '/schedule-meeting' },
    { label: t('nav.contact'), href: '/#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Anchor link — scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Page navigation
      startTransition(() => {
        router.push(href);
      });
    }
  };

  return (
    <>
      {/* Loading indicator */}
      {isPending && (
        <>
          <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] z-[9998] animate-pulse" suppressHydrationWarning />
          <div className="fixed inset-0 bg-white/30 z-[9997] pointer-events-none" suppressHydrationWarning />
        </>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 bg-white border-b border-gray-100 ${
          scrolled
            ? 'shadow-lg py-1.5'
            : 'py-2'
        }`}
        suppressHydrationWarning
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button onClick={() => handleNavClick('/')} className="flex items-center group">
              <img
                src="/BNHLogo.jpg"
                alt="BNH MasterKey Properties L.L.C"
                className="h-10 sm:h-16 sm:w-40 shrink-0 object-contain"
              />
            </button>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  disabled={isPending}
                  className="nav-link font-body text-sm font-medium text-gray-700 hover:text-[#C9A84C] transition-colors disabled:opacity-50"
                >
                  {link.label}
                </button>
              ))}
            </nav>

          <div className="hidden lg:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-gray-200 hover:border-[#C9A84C] text-gray-700 hover:text-[#C9A84C] transition-colors text-sm font-body font-medium"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              {lang === 'en' ? 'العربية' : 'English'}
            </button>

            <a
              href="tel:+971557757123"
              className="flex items-center gap-2 text-gray-700 hover:text-[#C9A84C] transition-colors text-sm font-body"
            >
              <Phone size={14} className="text-[#C9A84C]" />
              +971 55 775 7123
            </a>
            <button
              onClick={() => handleNavClick('/admin/login')}
              disabled={isPending}
              className="btn-gold px-5 py-2 rounded-sm text-sm font-body font-medium tracking-wide disabled:opacity-50"
            >
              {t('nav.admin')}
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-900 p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 mt-2">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  setMobileOpen(false);
                  handleNavClick(link.href);
                }}
                disabled={isPending}
                className="font-body text-gray-700 hover:text-[#C9A84C] transition-colors text-base text-left disabled:opacity-50"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {/* Mobile language toggle */}
              <button
                onClick={toggle}
                className="flex items-center gap-2 text-gray-700 hover:text-[#C9A84C] transition-colors text-sm font-body w-fit"
              >
                <Globe size={14} />
                {lang === 'en' ? 'العربية — Switch to Arabic' : 'English — التبديل إلى الإنجليزية'}
              </button>
              <a href="tel:+971557757123" className="flex items-center gap-2 text-gray-700 text-sm font-body">
                <Phone size={14} className="text-[#C9A84C]" />
                +971 55 775 7123
              </a>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleNavClick('/admin/login');
                }}
                disabled={isPending}
                className="btn-gold px-5 py-2.5 rounded-sm text-sm font-body font-medium text-center disabled:opacity-50"
              >
                {t('nav.admin')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
