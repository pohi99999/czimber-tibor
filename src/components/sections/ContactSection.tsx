import { useTranslations } from 'next-intl';
import FadeIn from '@/components/ui/FadeIn';

export default function ContactSection() {
  const t = useTranslations('contact');

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[var(--color-spotlight)] text-xs uppercase tracking-[0.4em] mb-4">{t('title')}</p>
            <div className="section-divider" />
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact details */}
            <FadeIn direction="right">
              <div className="p-8 rounded-2xl border border-[var(--color-walnut)]/40 bg-black/30 backdrop-blur-sm space-y-5">
              <h3
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('details_title')}
              </h3>

              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ),
                  content: <span>{t('name')}</span>,
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  content: <span>{t('address')}</span>,
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  content: (
                    <a href={`tel:${t('phone').replace(/\s/g, '')}`} className="hover:text-[var(--color-spotlight)] transition-colors duration-200">
                      {t('phone')}
                    </a>
                  ),
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  content: (
                    <a href={`mailto:${t('email')}`} className="hover:text-[var(--color-spotlight)] transition-colors duration-200">
                      {t('email')}
                    </a>
                  ),
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  content: <span>{t('vat_label')}<strong className="text-white">{t('vat')}</strong></span>,
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  ),
                  content: <span>{t('service_area')}</span>,
                },
              ].map(({ icon, content }, i) => (
                <div key={i} className="flex items-start gap-4 text-[var(--color-birch)]/80">
                  <span className="text-[var(--color-spotlight)] mt-0.5 flex-shrink-0">{icon}</span>
                  <div>{content}</div>
                </div>
              ))}
            </div>
            </FadeIn>

            {/* Google Maps */}
            <FadeIn direction="left">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-walnut)]/30 h-[420px]">
                <iframe
                  src="https://maps.google.com/maps?q=Dukai%20Tak%C3%A1cs%20Judit%20u.%209%2C%208900%20Zalaegerszeg&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(30%) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Czimber Tibor EV location"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
