import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BNH MasterKey — Premium Real Estate in the Emirates',
  description: 'Discover the most exclusive properties across Dubai, Abu Dhabi, Sharjah, and all UAE Emirates. Luxury villas, penthouses, apartments and commercial spaces.',
  keywords: 'UAE real estate, Dubai properties, luxury villas, penthouses, apartments UAE, buy property Dubai',
  openGraph: {
    title: 'BNH MasterKey — Premium Real Estate',
    description: 'Discover the most exclusive properties across UAE Emirates.',
    images: [{ url: 'https://images.pexels.com/photos/1467300/pexels-photo-1467300.jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://images.pexels.com/photos/1467300/pexels-photo-1467300.jpeg' }],
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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
