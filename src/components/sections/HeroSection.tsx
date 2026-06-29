import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/nkep.jpg"
      >
        <source src="/h1.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--color-stage)]/70 via-[var(--color-stage)]/50 to-[var(--color-stage)]/80" />

      {/* Content */}
      <div className="relative z-20 px-6 max-w-4xl mx-auto w-full">
        {/* Theatrical tagline */}
        <p className="text-[var(--color-spotlight)]/80 text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 font-light italic">
          {t('tagline')} {t('tagline2')}
        </p>

        {/* Single h1 for SEO – spans two visual lines via nested spans */}
        <h1
          className="font-bold text-white leading-tight mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="block text-3xl sm:text-5xl md:text-7xl mb-1">
            {t('title')}
          </span>
          <span
            className="block text-3xl sm:text-5xl md:text-7xl"
            style={{ color: 'var(--color-spotlight)' }}
          >
            {t('titleAccent')}
          </span>
        </h1>

        <p className="text-[var(--color-birch)]/80 text-base sm:text-lg md:text-xl mb-8 sm:mb-10">
          {t('subtitle')}
        </p>

        {/* CTA buttons – stacked on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#quote"
            className="w-full sm:w-auto inline-block bg-[var(--color-spotlight)] text-[var(--color-stage)] font-bold py-4 px-10 rounded-lg hover:bg-[var(--color-oak)] hover:scale-105 transition-all duration-300 text-base sm:text-lg shadow-lg shadow-[var(--color-spotlight)]/20"
          >
            {t('cta')}
          </a>
          <a
            href="#story"
            className="w-full sm:w-auto inline-block border border-white/30 text-white font-medium py-4 px-10 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
          >
            {t('credit')}
          </a>
        </div>

        <p className="text-[var(--color-stone)] text-xs sm:text-sm mt-4">{t('ctaSub')}</p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-6 h-6 text-[var(--color-stone)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

