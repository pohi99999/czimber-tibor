import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://czimber-tibor.vercel.app'),
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
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: 'https://czimber-tibor.vercel.app',
    siteName: 'Czimber Tibor Mesterasztalos',
    title: 'Czimber Tibor Mesterasztalos | Prémium Egyedi Bútorok',
    description:
      'Czimber Tibor prémium egyedi bútorok készítése mesteri és színházi precizitással. Konyhabútorok, beépített szekrények és belsőépítészeti munkák Zalaegerszegen és Ausztria egész területén.',
    images: [
      {
        url: 'https://czimber-tibor.vercel.app/logo.png',
        width: 1200,
        height: 630,
        alt: 'Czimber Tibor Mesterasztalos - Prémium Egyedi Bútorok',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Czimber Tibor Mesterasztalos | Prémium Egyedi Bútorok',
    description:
      'Czimber Tibor prémium egyedi bútorok készítése mesteri és színházi precizitással. Konyhabútorok, beépített szekrények és belsőépítészeti munkák Zalaegerszegen és Ausztria egész területén.',
    images: ['https://czimber-tibor.vercel.app/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


