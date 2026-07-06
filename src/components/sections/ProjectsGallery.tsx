'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import FadeIn from '@/components/ui/FadeIn';

const galleries: Record<string, string[]> = {
  kitchen: [
    'r2.jpg',
    'r4.jpg',
    'r9.jpg',
    'r13.jpg',
    'r22.jpg',
    'r30.jpg',
    'r31.jpg',
    'r32.jpg',
    'r33.jpg',
    'r34.jpg',
    'r37.jpg',
    'pic/Konyha/1224e6f7-8b66-44c3-a746-825fd153f151.jpg',
    'pic/Konyha/1ecd8268-ae32-4537-9393-625eaae7bfda.jpg',
    'pic/Konyha/3078c6db-39f2-47f9-8395-05c195dd181b.jpg',
    'pic/Konyha/32c4c36e-0b1e-458d-b91c-ea6702117615.jpg',
    'pic/Konyha/356c769d-d1a7-401f-9a8c-09e218933680.jpg',
    'pic/Konyha/39a82c9c-edf7-4714-8bfd-2c60ce90a9cc.jpg',
    'pic/Konyha/3d494763-7590-48de-a288-31cf9ea9009f.jpg',
    'pic/Konyha/3dad4508-279e-4f3b-96e6-2bee25258bc2.jpg',
    'pic/Konyha/3deac2b9-71f2-4337-9cb7-1c0dcd8cb4fd.jpg',
    'pic/Konyha/4a0c8b32-a769-4640-b4f3-c3e4e3fb0bbc (1).jpg',
    'pic/Konyha/4a0c8b32-a769-4640-b4f3-c3e4e3fb0bbc.jpg',
    'pic/Konyha/4de57c1c-8294-4776-89e5-509684d0090c.jpg',
    'pic/Konyha/4e174b6b-9e60-4831-8ffd-91a75a06a4f8.jpg',
    'pic/Konyha/689be18e-ae46-492a-8033-12d85139ab9c.jpg',
    'pic/Konyha/691b6fff-4e33-41c5-a948-e04f3fb90604.jpg',
    'pic/Konyha/6a10c681-2c81-426a-bac3-98e8b60fcfa9.jpg',
    'pic/Konyha/6c0a17fd-9d91-4bfb-9a7c-b03886e02c71.jpg',
    'pic/Konyha/6ce5c69f-d8ec-4c47-ad1c-a44631a4afb1.jpg',
    'pic/Konyha/6f088c43-5a18-4a01-8a51-d56156fe5f22.jpg',
    'pic/Konyha/702d7eee-e0e2-4551-b91e-f39fb8a70508.jpg',
    'pic/Konyha/80171a1f-6aea-4db1-8d2f-df8713abfd1a.jpg',
    'pic/Konyha/89f028af-6a39-4367-a1cb-441ad45f5602.jpg',
    'pic/Konyha/8d463195-9dcb-4904-8493-d1e6ed1323f0.jpg',
    'pic/Konyha/8e247197-bfb2-44e6-88ee-3f8582e45436.jpg',
    'pic/Konyha/9440b059-ada0-42cf-8e51-2f242a432d51.jpg',
    'pic/Konyha/a8d33247-c0a9-4b6d-8403-2b7e5755003a.jpg',
    'pic/Konyha/ada817a8-7126-4354-acf1-3d38b0d109ca.jpg',
    'pic/Konyha/b0832049-7119-41c2-abb4-0ba8b199ea05.jpg',
    'pic/Konyha/b0d5d2a7-05a4-48a0-9c7b-3d5be234fad1.jpg',
    'pic/Konyha/b1cbdeae-0278-4867-b68f-3e34e495fcdc.jpg',
    'pic/Konyha/b21353cf-0562-471f-ba74-607d570fb0ed.jpg',
    'pic/Konyha/c096d818-e055-46f6-ad0c-23f00fe2f847.jpg',
    'pic/Konyha/c0e372bb-9bcd-4c0c-8a3a-10649abb0abe.jpg',
    'pic/Konyha/c2d6294a-540d-4d5d-a7e5-e18f830a7ba5.jpg',
    'pic/Konyha/c60d76cd-e885-4bde-8b07-8f47baa29608.jpg',
    'pic/Konyha/c7c87cef-4012-4972-bf30-2df5b6bc51d3.jpg',
    'pic/Konyha/d3a4f114-fae7-4a72-bd9a-e24596fd64c6.jpg',
    'pic/Konyha/de973b33-2d56-4c1e-b9c1-12ab2833bcf8 (1).jpg',
    'pic/Konyha/de973b33-2d56-4c1e-b9c1-12ab2833bcf8.jpg',
    'pic/Konyha/df6fb7d8-2c16-45ce-b517-7a0cf52ef11d.jpg',
    'pic/Konyha/e3ef8366-23f1-4ca3-98eb-c37ddc140323.jpg',
    'pic/Konyha/e57bb553-1a43-4ce9-869e-ac0542a7e17b.jpg',
    'pic/Konyha/e96846b0-d50a-4088-a019-bb9836392696.jpg',
    'pic/Konyha/ea6acd21-d92b-40af-b1f4-dd16c0f63535.jpg',
    'pic/Konyha/ea7a2923-3521-4a25-8e3c-d54b095731a8.jpg',
    'pic/Konyha/ef050624-b6d1-4cca-aca6-5a71933c1a88.jpg',
    'pic/Konyha/f062896a-b4a8-4238-a523-fc7397c50035.jpg',
  ],
  wardrobe: [
    'r1.jpg',
    're.jpg',
    'r3.jpg',
    'r6.jpg',
    'r7.jpg',
    'r8.jpg',
    'r11.jpg',
    'r12.jpg',
    'r14.jpg',
    'r17.jpg',
    'r19.jpg',
    'r20.jpg',
    'r21.jpg',
    'r23.jpg',
    'r26.jpg',
    'r27.jpg',
    'r28.jpg',
  ],
  bathroom: [
    'pic/Fürdő/1d035f16-d056-4be7-a874-8ad91cf6f087.jpg',
    'pic/Fürdő/a4f84973-7981-4490-b769-dffee98e3250.jpg',
    'pic/Fürdő/f776cb46-dac3-4c33-9d67-7076eb42c2af.jpg',
  ],
  hallway: [
    'pic/Előszoba/0cee57d3-ad0d-45f8-ba1d-7b3be9521c96.jpg',
    'pic/Előszoba/18f08d39-9bbe-49f8-be52-fc0a29788826.jpg',
    'pic/Előszoba/5cf4c7c0-d1f9-46eb-bf66-9a2407f41e87.jpg',
    'pic/Előszoba/5d949bf6-ec4b-4027-8aa5-6e09d7eeec91.jpg',
    'pic/Előszoba/6acdd1d4-d5f8-4274-8d71-0acb937f11ab.jpg',
    'pic/Előszoba/793179e2-8262-4dd3-8e4e-ca249297eba8.jpg',
    'pic/Előszoba/af584c6f-adf7-40cf-97c3-fba1c464c469.jpg',
    'pic/Előszoba/dfb73511-a328-4f0d-b573-12810549ef86.jpg',
    'pic/Előszoba/fb394d5f-a6e5-48eb-920c-6b6bd1ca6a2e.jpg',
  ],
  stairs: ['r5.jpg', 'r10.jpg', 'r24.jpg'],
  other: [
    'r29.jpg',
    'r15.jpg',
    'r16.jpg',
    'r18.jpg',
    'r25.jpg',
    'r32.jpg',
    'r35.jpg',
    'pic/Egyéb/1.jpg',
    'pic/Egyéb/2357fb79-7a3a-42c3-badb-b5e1c0fb6ed1.jpg',
    'pic/Egyéb/39469e26-e58a-47fa-a28d-fd5931f336e4.jpg',
    'pic/Egyéb/4b3078a0-48a6-4170-bdc4-6ec0a61bcb18.jpg',
    'pic/Egyéb/6b181558-80b3-488c-8b15-655d766f12a3.jpg',
    'pic/Egyéb/775d3e88-0829-40d4-9d43-5fe08b8431c5.jpg',
    'pic/Egyéb/829068a0-0f24-4ba6-a121-a376c49b1e7f.jpg',
    'pic/Egyéb/8fadb9ed-5169-44c0-b0d8-39dbe9160416.jpg',
    'pic/Egyéb/955a355a-e2e8-4fe4-824c-147d7c592c0b.jpg',
    'pic/Egyéb/98fd1eda-aa7e-438d-88a1-32585813a5f8.jpg',
    'pic/Egyéb/a4537c36-2fe1-4b4a-9ef3-ee12a0676eb6.jpg',
    'pic/Egyéb/a6acc235-9259-41ea-bd99-cb9d366e7bab.jpg',
    'pic/Egyéb/c3ed5346-7c80-46d8-a2c3-151e2547b5e6.jpg',
    'pic/Egyéb/c4837d05-6b2a-4e5e-860c-704833c18e0f.jpg',
    'pic/Egyéb/cc0bde3a-60d8-4132-98ed-1a97617f7410.jpg',
    'pic/Egyéb/d934c3d6-9c72-40a9-8df1-0f7ef5428fe6.jpg',
    'pic/Egyéb/e8b6bd5f-519e-41ab-88a8-1247442c001e.jpg',
    'pic/Egyéb/ebbe5b5f-ff06-4944-b5be-95b8e7248fc2.jpg',
  ],
};

const coverImages: Record<string, string> = {
  kitchen: 'r4.jpg',
  wardrobe: 'r27.jpg',
  bathroom: 'pic/Fürdő/a4f84973-7981-4490-b769-dffee98e3250.jpg',
  hallway: 'pic/Előszoba/af584c6f-adf7-40cf-97c3-fba1c464c469.jpg',
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
      {/* Counter – fixed top-center, glassmorphism */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[101] text-white/80 text-sm bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full whitespace-nowrap pointer-events-none">
        {current + 1} / {images.length}
      </div>

      {/* Close – fixed top-right, glassmorphism */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label={labelClose}
        className="fixed top-4 right-4 z-[101] bg-white/10 backdrop-blur-md hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image – stops click from bubbling up to the backdrop */}
      <img
        src={`/${encodeURI(images[current])}`}
        alt={`Gallery image ${current + 1} of ${images.length}`}
        loading="lazy"
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[80vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl"
      />

      {/* Prev – fixed left edge, glassmorphism */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label={labelPrev}
          className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-[101] bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next – fixed right edge, glassmorphism */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label={labelNext}
          className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-[101] bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
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
          src={`/${encodeURI(cover)}`}
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
    { key: 'bathroom', title: t('bathroom') },
    { key: 'hallway', title: t('hallway') },
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
