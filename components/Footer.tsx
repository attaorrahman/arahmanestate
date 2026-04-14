'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Instagram, Linkedin, Twitter, Facebook, Phone, Mail, MapPin, ArrowRight, Send } from 'lucide-react';

const emirateLinks = [
  { label: 'Dubai', href: '/properties/dubai' },
  { label: 'Abu Dhabi', href: '/properties/abu-dhabi' },
  { label: 'Sharjah', href: '/properties/sharjah' },
  { label: 'Ajman', href: '/properties/ajman' },
  { label: 'Ras Al Khaimah', href: '/properties/ras-al-khaimah' },
  { label: 'Fujairah', href: '/properties/fujairah' },
];

const quickLinks = [
  { label: 'Properties for Sale', href: '/properties/dubai?type=sale' },
  { label: 'Properties for Rent', href: '/properties/dubai?type=rent' },
  { label: 'Featured Properties', href: '/#featured' },
  { label: 'Why Choose Us', href: '/#about' },
  { label: 'Contact Agent', href: '/#contact' },
  { label: 'List Your Property', href: '/#contact' },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#080808] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <img
                src="/logo.jpeg"
                alt="BNH MasterKey logo"
                className="w-12 h-12 shrink-0 object-contain"
              />
              <div className="leading-tight">
                <span className="font-display text-white text-base font-bold tracking-[0.15em] block">
                  BNH <span className="text-[#C9A84C]">MASTERKEY</span>
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-px flex-1 bg-white/25" />
                  <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-body leading-none whitespace-nowrap">
                    Properties L.L.C
                  </span>
                  <span className="h-px flex-1 bg-white/25" />
                </div>
              </div>
            </Link>
            <p className="font-body text-sm leading-relaxed mb-6 text-gray-500">
              UAE premier luxury real estate platform. Connecting discerning buyers with
              extraordinary properties across the Emirates since 2014.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-sm bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-white font-semibold text-base mb-5">
              Browse by Emirate
            </h4>
            <ul className="space-y-3">
              {emirateLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-gray-500 hover:text-[#C9A84C] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-[#C9A84C] transition-opacity -ml-3.5 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-white font-semibold text-base mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-gray-500 hover:text-[#C9A84C] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-[#C9A84C] transition-opacity -ml-3.5 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              <h4 className="font-display text-white font-semibold text-base">
                Contact Info
              </h4>
              {[
                { icon: Phone, text: '+971 55 775 7123' },
                { icon: Mail, text: 'info@bnhmasterkey.ae' },
                { icon: MapPin, text: 'DIFC Gate Village, Dubai' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 font-body text-sm text-gray-500">
                  <Icon size={13} className="text-[#C9A84C] shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-white font-semibold text-base mb-2">
              Newsletter
            </h4>
            <p className="font-body text-sm text-gray-500 mb-5">
              Get exclusive property listings and UAE market insights delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-sm p-4 text-sm font-body text-[#C9A84C]">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-white/5 border border-white/8 rounded-sm px-4 py-3 text-white text-sm font-body placeholder-gray-600 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                />
                <button
                  type="submit"
                  className="btn-gold flex items-center justify-center gap-2 py-3 rounded-sm font-body text-sm font-medium"
                >
                  <Send size={14} />
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-gray-600">
            &copy; {new Date().getFullYear()} LuxEstate UAE. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-body text-xs text-gray-600 hover:text-[#C9A84C] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
