import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import ClientProviders from '@/components/ClientProviders';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ApplianceWise - Your Buying Guide',
  description: "India's most trusted appliance buying guide. Compare prices, read expert reviews, and get AI-powered recommendations for TVs, ACs, Refrigerators",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <ClientProviders />
        <Toaster />
      </body>
    </html>
  );
}
