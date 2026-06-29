import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
    >
      {/* Background video – object-cover fills the viewport */}
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

      {/* Layered overlay for WCAG AA contrast guarantee */}
      {/* Bottom layer: dark fill */}
      <div className="absolute inset-0 z-10 bg-[var(--color-stage)]/60" />
      {/* Top layer: directional gradient for cinematic feel */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--color-stage)]/50 via-transparent to-[var(--color-stage)]/80" />

      {/* Content */}
      <div className="relative z-20 px-6 max-w-5xl mx-auto w-full pt-24">
        {/* Theatrical eyebrow */}
        <p className="text-[var(--color-spotlight)] text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.35em] mb-5 font-light italic opacity-90">
          {t('tagline')} {t('tagline2')}
        </p>

        {/* Single h1 – two visual lines via spans */}
        <h1
          className="font-bold text-white leading-[1.05] mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-1 drop-shadow-lg">
            {t('title')}
          </span>
          <span
            className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg"
            style={{ color: 'var(--color-spotlight)' }}
          >
            {t('titleAccent')}
          </span>
        </h1>

        <p className="text-[var(--color-birch)]/75 text-base sm:text-lg md:text-xl mb-10 leading-relaxed tracking-wide">
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#quote"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[var(--color-spotlight)] text-[var(--color-stage)] font-bold py-4 px-10 rounded-xl hover:bg-[var(--color-oak)] hover:scale-105 active:scale-100 transition-all duration-300 text-base shadow-lg shadow-[var(--color-spotlight)]/25 ring-offset-2 ring-offset-transparent"
          >
            {t('cta')}
          </a>
          <a
            href="#story"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-white/25 bg-white/5 backdrop-blur-sm text-white font-medium py-4 px-10 rounded-xl hover:bg-white/15 hover:border-white/40 transition-all duration-300 text-sm sm:text-base"
          >
            {t('credit')}
          </a>
        </div>

        <p className="text-[var(--color-stone)] text-xs sm:text-sm mt-5 tracking-wider">
          {t('ctaSub')}
        </p>
      </div>

      {/* Scroll indicator – safe area aware */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <a
          href="#story"
          aria-label="Scroll down"
          className="flex flex-col items-center gap-2 text-[var(--color-stone)]/60 hover:text-[var(--color-spotlight)] transition-colors duration-300 group"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] hidden sm:block">Scroll</span>
          <svg
            className="w-5 h-5 animate-bounce group-hover:animate-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
