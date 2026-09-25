import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { MarketProvider } from '@/context/MarketContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
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
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <MarketProvider>
          {children}
        </MarketProvider>
      </body>
    </html>
  );
}
