'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Properties', href: '/properties/dubai' },
  { label: 'Emirates', href: '/#emirates' },
  { label: 'Our Team', href: '/#team' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-[#0D0D0D]/97 backdrop-blur-md shadow-2xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.jpeg"
              alt="BNH MasterKey logo"
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 object-contain"
            />

            <div className="leading-tight">
              <span className="font-display text-white text-base sm:text-lg font-bold tracking-[0.15em] block">
                BNH <span className="text-gold">MASTERKEY</span>
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="h-px flex-1 bg-white/30" />
                <span className="text-[9px] sm:text-[10px] text-gray-300 tracking-[0.3em] uppercase font-body leading-none whitespace-nowrap">
                  Properties L.L.C
                </span>
                <span className="h-px flex-1 bg-white/30" />
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="nav-link font-body text-sm font-medium text-gray-300 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+97145551234"
              className="flex items-center gap-2 text-gray-300 hover:text-gold transition-colors text-sm font-body"
            >
              <Phone size={14} className="text-gold" />
              +971 55 775 7123
            </a>
            <Link
              href="/#contact"
              className="btn-gold px-5 py-2.5 rounded-sm text-sm font-body font-medium tracking-wide"
            >
              List Property
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0D0D0D]/98 backdrop-blur-md border-t border-white/10 mt-2">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-gray-300 hover:text-gold transition-colors text-base"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a href="tel:+971557757123" className="flex items-center gap-2 text-gray-300 text-sm font-body">
                <Phone size={14} className="text-gold" />
                +971 55 775 7123
              </a>
              <Link
                href="/#contact"
                className="btn-gold px-5 py-2.5 rounded-sm text-sm font-body font-medium text-center"
                onClick={() => setMobileOpen(false)}
              >
                List Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
