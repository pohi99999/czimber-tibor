import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://czimber-tibor.vercel.app'),
  title: {
    default: 'Czimber Tibor EV – Egyedi Bútorok és Asztalos Munkák',
    template: '%s | Czimber Tibor EV',
  },
  description:
    'Tapasztalt mesterasztalos Zalaegerszegen. Egyedi konyhabútorok, beépített szekrények, lépcsők és belsőépítészeti megoldások – milliméteres precizitással.',
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

