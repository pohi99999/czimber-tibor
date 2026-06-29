import { useTranslations } from 'next-intl';
import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-3 sm:p-6 border border-[var(--color-walnut)]/50 rounded-xl bg-[var(--color-walnut)]/20">
      <div
        className="text-2xl sm:text-4xl font-bold text-[var(--color-spotlight)] mb-1 sm:mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {value}
      </div>
      <div className="text-[10px] sm:text-sm text-[var(--color-birch)]/70 uppercase tracking-wider leading-tight">{label}</div>
    </div>
  );
}

function ActBlock({
  actLabel,
  title,
  text,
  isLast = false,
}: {
  actLabel: string;
  title: string;
  text: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-6">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-[var(--color-spotlight)] flex items-center justify-center text-[var(--color-stage)] text-sm font-bold shadow-lg shadow-[var(--color-spotlight)]/30">
          🎭
        </div>
        {!isLast && <div className="flex-1 w-px bg-gradient-to-b from-[var(--color-spotlight)]/40 to-transparent mt-2 min-h-12" />}
      </div>
      {/* Content */}
      <div className="pb-10">
        <p className="text-[var(--color-spotlight)] text-xs uppercase tracking-widest mb-1">{actLabel}</p>
        <h3
          className="text-xl font-bold text-white mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
        <p className="text-[var(--color-birch)]/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function TheatreOriginStory() {
  const t = useTranslations('story');

  return (
    <section id="story" className="py-24 md:py-32 relative">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-stage)] via-[var(--color-smoke)] to-[var(--color-stage)] opacity-60" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        {/* Section header */}
        <FadeIn className="text-center mb-16">
          <p className="text-[var(--color-spotlight)] text-xs uppercase tracking-[0.4em] mb-4">{t('label')}</p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[var(--color-birch)]/60 text-lg italic leading-relaxed">{t('subtitle')}</p>
          <div className="section-divider" />
        </FadeIn>

        {/* Two-column layout: timeline + image */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Timeline story */}
          <div>
            <FadeIn delay={0.1}>
              <ActBlock actLabel={t('act1_label')} title={t('act1_title')} text={t('act1_text')} />
            </FadeIn>
            <FadeIn delay={0.2}>
              <ActBlock actLabel={t('act2_label')} title={t('act2_title')} text={t('act2_text')} />
            </FadeIn>
            <FadeIn delay={0.3}>
              <ActBlock actLabel={t('act3_label')} title={t('act3_title')} text={t('act3_text')} isLast />
            </FadeIn>
          </div>

          {/* Right: Image + stats */}
          <FadeIn direction="left" className="space-y-8 md:sticky md:top-28">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-[var(--color-walnut)]/30">
              <Image
                src="/nkep.jpg"
                alt="Czimber Tibor mesterasztalos – egyedi bútor és lépcsőkivitelezés Zalaegerszegen"
                width={600}
                height={400}
                className="w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
              {/* Cinematic overlay quote */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-6">
                <blockquote
                  className="text-[var(--color-birch)] text-sm italic leading-relaxed"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  &ldquo;Minden milliméter egy döntés. Minden illesztés egy elköteleződés.&rdquo;
                </blockquote>
                <p className="text-[var(--color-spotlight)] text-xs mt-2 tracking-wider">— Czimber Tibor</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard value={t('stat1_value')} label={t('stat1_label')} />
              <StatCard value={t('stat2_value')} label={t('stat2_label')} />
              <StatCard value={t('stat3_value')} label={t('stat3_label')} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
