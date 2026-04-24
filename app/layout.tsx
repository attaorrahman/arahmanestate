import './globals.css';
import type { Metadata } from 'next';
import LoadingScreen from '@/components/LoadingScreen';
import { LanguageProvider } from '@/lib/language-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://bnhmasterkey.ae'),
  title: {
    default: 'BNH MasterKey — Premium Real Estate in the UAE',
    template: '%s | BNH MasterKey',
  },
  description:
    'BNH MasterKey — Premium UAE real estate brokerage. Discover exclusive villas, penthouses, apartments and commercial properties across Dubai, Abu Dhabi, Sharjah and all Emirates.',
  keywords: [
    'BNH MasterKey',
    'bnhmasterkey',
    'UAE real estate',
    'Dubai properties',
    'Abu Dhabi properties',
    'luxury villas UAE',
    'penthouses Dubai',
    'apartments UAE',
    'buy property Dubai',
    'real estate brokerage UAE',
  ],
  applicationName: 'BNH MasterKey',
  authors: [{ name: 'BNH MasterKey' }],
  creator: 'BNH MasterKey',
  publisher: 'BNH MasterKey',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://bnhmasterkey.ae',
    siteName: 'BNH MasterKey',
    title: 'BNH MasterKey — Premium Real Estate in the UAE',
    description:
      'Discover exclusive villas, penthouses and apartments across Dubai and the UAE with BNH MasterKey.',
    images: [
      {
        url: 'https://images.pexels.com/photos/1467300/pexels-photo-1467300.jpeg',
        width: 1200,
        height: 630,
        alt: 'BNH MasterKey — Premium UAE Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BNH MasterKey — Premium Real Estate in the UAE',
    description:
      'Discover exclusive villas, penthouses and apartments across Dubai and the UAE.',
    images: ['https://images.pexels.com/photos/1467300/pexels-photo-1467300.jpeg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: 'BNH MasterKey',
              url: 'https://bnhmasterkey.ae',
              email: 'info@bnhmasterkey.ae',
              areaServed: [
                { '@type': 'AdministrativeArea', name: 'Dubai' },
                { '@type': 'AdministrativeArea', name: 'Abu Dhabi' },
                { '@type': 'AdministrativeArea', name: 'Sharjah' },
                { '@type': 'Country', name: 'United Arab Emirates' },
              ],
              description:
                'Premium UAE real estate brokerage offering exclusive villas, penthouses, apartments and commercial properties across the Emirates.',
            }),
          }}
        />
        <LanguageProvider>
          <LoadingScreen />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
