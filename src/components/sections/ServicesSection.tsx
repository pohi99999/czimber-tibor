import { useTranslations } from 'next-intl';
import FadeIn from '@/components/ui/FadeIn';

const serviceIcons = {
  kitchen: '🍳',
  custom: '🪚',
  stairs: '🪜',
  assembly: '🔧',
};

function ServiceCard({
  icon,
  title,
  description,
  wide = false,
}: {
  icon: string;
  title: string;
  description: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`group relative p-8 rounded-xl border border-[var(--color-walnut)]/40 bg-black/30 backdrop-blur-sm hover:border-[var(--color-spotlight)]/50 hover:bg-[var(--color-walnut)]/20 transition-all duration-300 ${
        wide ? 'md:col-span-2 lg:col-span-4' : ''
      }`}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3
        className="text-xl font-bold text-[var(--color-spotlight)] mb-3 group-hover:text-[var(--color-birch)] transition-colors duration-300"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      <p className="text-[var(--color-birch)]/70 leading-relaxed text-sm">{description}</p>
      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[var(--color-spotlight)] group-hover:w-full transition-all duration-500 rounded-b-xl" />
    </div>
  );
}

export default function ServicesSection() {
  const t = useTranslations('services');

  return (
    <section id="services" className="py-24 md:py-32 bg-[var(--color-smoke)]/40">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Motto */}
          <FadeIn>
            <blockquote
              className="text-center text-xl md:text-2xl text-[var(--color-birch)]/80 italic mb-16 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('motto')}
            </blockquote>
          </FadeIn>

          {/* Services grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: serviceIcons.kitchen, title: t('kitchen_title'), desc: t('kitchen_desc'), delay: 0.1 },
              { icon: serviceIcons.custom, title: t('custom_title'), desc: t('custom_desc'), delay: 0.2 },
              { icon: serviceIcons.stairs, title: t('stairs_title'), desc: t('stairs_desc'), delay: 0.3 },
            ].map(({ icon, title, desc, delay }) => (
              <FadeIn key={title} delay={delay}>
                <ServiceCard icon={icon} title={title} description={desc} />
              </FadeIn>
            ))}
            <FadeIn delay={0.4}>
              <ServiceCard
                icon={serviceIcons.assembly}
                title={t('assembly_title')}
                description={t('assembly_desc')}
                wide
              />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
