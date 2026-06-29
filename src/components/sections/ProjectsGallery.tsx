'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import FadeIn from '@/components/ui/FadeIn';

const galleries: Record<string, string[]> = {
  kitchen: ['r2.jpg', 'r4.jpg', 'r9.jpg', 'r13.jpg', 'r22.jpg', 'r30.jpg', 'r31.jpg', 'r32.jpg', 'r33.jpg', 'r34.jpg', 'r37.jpg'],
  wardrobe: ['r1.jpg', 're.jpg', 'r3.jpg', 'r6.jpg', 'r7.jpg', 'r8.jpg', 'r11.jpg', 'r12.jpg', 'r14.jpg', 'r17.jpg', 'r19.jpg', 'r20.jpg', 'r21.jpg', 'r23.jpg', 'r26.jpg', 'r27.jpg', 'r28.jpg'],
  stairs: ['r5.jpg', 'r10.jpg', 'r24.jpg'],
  other: ['r29.jpg', 'r15.jpg', 'r16.jpg', 'r18.jpg', 'r25.jpg', 'r32.jpg', 'r35.jpg'],
};

const coverImages: Record<string, string> = {
  kitchen: 'r4.jpg',
  wardrobe: 'r27.jpg',
  stairs: 'r5.jpg',
  other: 'r29.jpg',
};

function Lightbox({
  images,
  index,
  onClose,
  labelClose,
  labelPrev,
  labelNext,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  labelClose: string;
  labelPrev: string;
  labelNext: string;
}) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    // Prevent body scroll while lightbox is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex items-center justify-center w-full px-14 sm:px-0" onClick={(e) => e.stopPropagation()}>
        {/* Image */}
        <img
          src={`/${images[current]}`}
          alt={`Gallery image ${current + 1} of ${images.length}`}
          loading="lazy"
          className="max-w-[90vw] max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Counter */}
        <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:text-sm bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
          {current + 1} / {images.length}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label={labelClose}
          className="absolute top-2 right-2 sm:-top-4 sm:-right-4 bg-[var(--color-walnut)] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--color-spotlight)] hover:text-[var(--color-stage)] transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev – anchored to left edge of px-14 area on mobile, outside image on desktop */}
        {images.length > 1 && (
          <button
            onClick={prev}
            aria-label={labelPrev}
            className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--color-spotlight)] hover:text-[var(--color-stage)] transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={next}
            aria-label={labelNext}
            className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--color-spotlight)] hover:text-[var(--color-stage)] transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function GalleryCard({
  galleryKey,
  title,
  cover,
  onOpen,
  btnLabel,
}: {
  galleryKey: string;
  title: string;
  cover: string;
  onOpen: (key: string) => void;
  btnLabel: string;
}) {
  return (
    <div className="group flex flex-col rounded-xl overflow-hidden border border-[var(--color-walnut)]/30 bg-black/30 hover:border-[var(--color-spotlight)]/50 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300">
      {/* aspect-video ensures consistent 16:9 ratio without distortion */}
      <div className="relative overflow-hidden aspect-video">
        <Image
          src={`/${cover}`}
          alt={`Czimber Tibor asztalos munkája – ${title.toLowerCase()} kategória`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <h3
          className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
      </div>
      <div className="p-4">
        <button
          onClick={() => onOpen(galleryKey)}
          className="w-full bg-[var(--color-spotlight)] text-[var(--color-stage)] font-semibold py-3 px-4 rounded-lg hover:bg-[var(--color-oak)] active:scale-95 transition-all duration-200 text-sm min-h-[44px]"
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}

export default function ProjectsGallery() {
  const t = useTranslations('gallery');
  const [lightbox, setLightbox] = useState<{ key: string; index: number } | null>(null);

  const categories = [
    { key: 'kitchen', title: t('kitchen') },
    { key: 'wardrobe', title: t('wardrobe') },
    { key: 'stairs', title: t('stairs') },
    { key: 'other', title: t('other') },
  ];

  return (
    <section id="references" className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[var(--color-spotlight)] text-xs uppercase tracking-[0.4em] mb-4">{t('title')}</p>
            <p className="text-[var(--color-birch)]/70 max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
            <div className="section-divider" />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(({ key, title }, i) => (
              <FadeIn key={key} delay={i * 0.1}>
                <GalleryCard
                  galleryKey={key}
                  title={title}
                  cover={coverImages[key]}
                  onOpen={(k) => setLightbox({ key: k, index: 0 })}
                  btnLabel={t('view')}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          images={galleries[lightbox.key]}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          labelClose={t('close')}
          labelPrev={t('prev')}
          labelNext={t('next')}
        />
      )}
    </section>
  );
}
