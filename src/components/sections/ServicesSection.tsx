import { useTranslations } from 'next-intl';

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
    <section id="services" className="py-20 md:py-32 bg-[var(--color-smoke)]/40">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Motto */}
          <blockquote
            className="text-center text-xl md:text-2xl text-[var(--color-birch)]/80 italic mb-16 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('motto')}
          </blockquote>

          {/* Services grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={serviceIcons.kitchen}
              title={t('kitchen_title')}
              description={t('kitchen_desc')}
            />
            <ServiceCard
              icon={serviceIcons.custom}
              title={t('custom_title')}
              description={t('custom_desc')}
            />
            <ServiceCard
              icon={serviceIcons.stairs}
              title={t('stairs_title')}
              description={t('stairs_desc')}
            />
            <ServiceCard
              icon={serviceIcons.assembly}
              title={t('assembly_title')}
              description={t('assembly_desc')}
              wide
            />
          </div>
        </div>
      </div>
    </section>
  );
}
