'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const QUERY = 'Dukai Takács Judit u. 9, 8900 Zalaegerszeg';

// The Google map loads only after the visitor asks for it (Lumen 3360 K3): until then nothing is
// requested from Google and no Google cookie is set. The plain link opens Google Maps instead.
export default function ClickToLoadMap() {
  const t = useTranslations('contact');
  const [show, setShow] = useState(false);
  const q = encodeURIComponent(QUERY);

  if (show) {
    return (
      <iframe
        src={`https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'grayscale(30%) contrast(1.1)' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={t('map_title')}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center bg-black/40">
      <svg className="w-10 h-10 text-[var(--color-spotlight)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p className="text-[var(--color-birch)]/80 text-sm max-w-xs leading-relaxed">{t('map_notice')}</p>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="px-5 py-3 min-h-[44px] bg-[var(--color-spotlight)] text-[var(--color-stage)] font-semibold rounded-lg hover:bg-[var(--color-oak)] transition-colors duration-200 text-sm"
      >
        {t('map_load')}
      </button>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-spotlight)] text-sm underline hover:text-white"
      >
        {t('map_open')}
      </a>
    </div>
  );
}
