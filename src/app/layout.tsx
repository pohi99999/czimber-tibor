import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://czimber-tibor.vercel.app'),
  // the per-language title, description, Open Graph and Twitter tags live in app/[locale]
  title: {
    default: 'Czimber Tibor Mesterasztalos | Prémium Egyedi Bútorok',
    template: '%s | Czimber Tibor Mesterasztalos',
  },
  description:
    'Czimber Tibor prémium egyedi bútorok készítése mesteri és színházi precizitással. Konyhabútorok, beépített szekrények és belsőépítészeti munkák Zalaegerszegen és Ausztria egész területén.',
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


