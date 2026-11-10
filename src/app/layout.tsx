import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';
import { MarketProvider } from '@/context/MarketContext';

export const metadata: Metadata = {
  title: 'CampusMart Ghana | Peer-to-Peer Student Marketplace',
  description: 'Buy, sell, and trade textbooks, laptops, mini-fridges, dorm essentials, and gadgets safely with students on your university campus in Ghana (UG Legon, KNUST, UCC, UPSA, Ashesi).',
  keywords: 'campus marketplace, Ghana student e-commerce, Legon student market, KNUST buy and sell, dorm essentials, Ghanaian cedis',
  authors: [{ name: 'CampusMart Team' }],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-ink antialiased selection:bg-primary selection:text-white">
        <MarketProvider>
          {children}
        </MarketProvider>
      </body>
    </html>
  );
}
