'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Instagram, Linkedin, Twitter, Facebook, Phone, Mail, MapPin, ArrowRight, Send } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

const emirateLinks = [
  { key: 'Dubai', href: '/properties/dubai' },
  { key: 'Abu Dhabi', href: '/properties/abu-dhabi' },
  { key: 'Sharjah', href: '/properties/sharjah' },
  { key: 'Ajman', href: '/properties/ajman' },
  { key: 'Ras Al Khaimah', href: '/properties/ras-al-khaimah' },
  { key: 'Fujairah', href: '/properties/fujairah' },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
];

export default function Footer() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t, dir } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNavigation = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const quickLinks = [
    { label: t('footer.for_sale'), href: '/properties/dubai?type=sale' },
    { label: t('footer.for_rent'), href: '/properties/dubai?type=rent' },
    { label: t('footer.featured'), href: '/#featured' },
    { label: t('footer.why_us'), href: '/#about' },
    { label: t('footer.contact_agent'), href: '/#contact' },
    { label: t('footer.list_property'), href: '/#contact' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#080808] text-gray-400" dir={dir}>
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
                    {t('common.properties_llc')}
                  </span>
                  <span className="h-px flex-1 bg-white/25" />
                </div>
              </div>
            </Link>
            <p className="font-body text-sm leading-relaxed mb-6 text-gray-500">
              {t('footer.description')}
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
              {t('footer.browse_emirate')}
            </h4>
            <>
              {isPending && (
                <div className="fixed inset-0 bg-white/30 z-[9997] pointer-events-none" />
              )}
              <ul className="space-y-3">
                {emirateLinks.map((link) => (
                  <li key={link.key}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      disabled={isPending}
                      className="font-body text-sm text-gray-500 hover:text-[#C9A84C] transition-colors flex items-center gap-2 group text-left disabled:opacity-50"
                    >
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-[#C9A84C] transition-opacity -ml-3.5 group-hover:ml-0" />
                      {link.key}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          </div>

          <div>
            <h4 className="font-display text-white font-semibold text-base mb-5">
              {t('footer.quick_links')}
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
                {t('footer.contact_info')}
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
              {t('footer.newsletter')}
            </h4>
            <p className="font-body text-sm text-gray-500 mb-5">
              {t('footer.newsletter_desc')}
            </p>
            {subscribed ? (
              <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-sm p-4 text-sm font-body text-[#C9A84C]">
                {t('footer.subscribed')}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.email_placeholder')}
                  className="bg-white/5 border border-white/8 rounded-sm px-4 py-3 text-white text-sm font-body placeholder-gray-600 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                />
                <button
                  type="submit"
                  className="btn-gold flex items-center justify-center gap-2 py-3 rounded-sm font-body text-sm font-medium"
                >
                  <Send size={14} />
                  {t('footer.subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            {[
              { label: t('footer.privacy'), href: '#' },
              { label: t('footer.terms'), href: '#' },
              { label: t('footer.cookies'), href: '#' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-body text-xs text-gray-600 hover:text-[#C9A84C] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
