import type { Metadata } from 'next';
import './globals.css';

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
  return children;
}

