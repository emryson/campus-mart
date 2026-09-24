import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { MarketProvider } from '@/context/MarketContext';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CampusMart Ghana | Peer-to-Peer Student Marketplace',
  description: 'Buy, sell, and trade textbooks, laptops, mini-fridges, dorm essentials, and gadgets safely with students on your university campus in Ghana (UG Legon, KNUST, UCC, UPSA, Ashesi).',
  keywords: 'campus marketplace, Ghana student e-commerce, Legon student market, KNUST buy and sell, dorm essentials, Ghanaian cedis',
  authors: [{ name: 'CampusMart Team' }],
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
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <MarketProvider>
          {children}
        </MarketProvider>
      </body>
    </html>
  );
}
