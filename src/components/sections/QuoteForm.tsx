'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import FadeIn from '@/components/ui/FadeIn';
import { Link } from '@/i18n/routing';

type ProjectType = 'kitchen' | 'wardrobe' | 'stairs' | 'interior' | 'assembly' | 'other';
type Location = 'local' | 'other' | 'austria';
type Timeline = '1_3' | '3_6' | 'undecided';
type Budget = 'under500' | '500_1500' | 'over1500' | 'unknown';

interface FormData {
  types: ProjectType[];
  location: Location | '';
  timeline: Timeline | '';
  budget: Budget | '';
  name: string;
  email: string;
  phone: string;
  description: string;
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center flex-1 last:flex-none">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              n <= step
                ? 'bg-[var(--color-spotlight)] text-[var(--color-stage)]'
                : 'bg-[var(--color-walnut)]/40 text-[var(--color-stone)]'
            }`}
          >
            {n < step ? '✓' : n}
          </div>
          {n < 3 && (
            <div
              className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${
                n < step ? 'bg-[var(--color-spotlight)]' : 'bg-[var(--color-walnut)]/30'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function TypeButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3.5 rounded-lg border text-sm font-medium transition-all duration-200 min-h-[44px] ${
        selected
          ? 'border-[var(--color-spotlight)] bg-[var(--color-spotlight)]/20 text-[var(--color-spotlight)]'
          : 'border-[var(--color-walnut)]/40 text-[var(--color-birch)]/70 hover:border-[var(--color-spotlight)]/40 hover:text-[var(--color-birch)]'
      }`}
    >
      {label}
    </button>
  );
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
  cols2 = false,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  cols2?: boolean;
}) {
  return (
    <div>
      <p className="text-[var(--color-birch)]/80 text-sm font-medium mb-3">{label}</p>
      <div className={`grid gap-3 ${cols2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-3.5 rounded-lg border text-sm transition-all duration-200 min-h-[44px] ${
              value === opt.value
                ? 'border-[var(--color-spotlight)] bg-[var(--color-spotlight)]/20 text-[var(--color-spotlight)]'
                : 'border-[var(--color-walnut)]/40 text-[var(--color-birch)]/70 hover:border-[var(--color-spotlight)]/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FieldInput({
  id,
  label,
  type = 'text',
  autoComplete,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-birch)]/80 mb-1.5">{label}</label>
      <input
        id={id}
        name={id}
        autoComplete={autoComplete}
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--color-walnut)]/20 border border-[var(--color-walnut)]/40 rounded-lg px-4 py-3 text-white placeholder-[var(--color-stone)]/70 focus:outline-none focus:border-[var(--color-spotlight)] focus:ring-2 focus:ring-[var(--color-spotlight)]/30 transition-all duration-200 leading-relaxed"
      />
    </div>
  );
}

export default function QuoteForm() {
  const t = useTranslations('quote');
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<FormData>({
    types: [],
    location: '',
    timeline: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
    description: '',
  });

  const toggleType = (type: ProjectType) =>
    setForm((f) => ({
      ...f,
      types: f.types.includes(type) ? f.types.filter((t) => t !== type) : [...f.types, type],
    }));

  const projectTypes: { value: ProjectType; label: string }[] = [
    { value: 'kitchen', label: t('type_kitchen') },
    { value: 'wardrobe', label: t('type_wardrobe') },
    { value: 'stairs', label: t('type_stairs') },
    { value: 'interior', label: t('type_interior') },
    { value: 'assembly', label: t('type_assembly') },
    { value: 'other', label: t('type_other') },
  ];

  const locationOptions = [
    { value: 'local', label: t('location_local') },
    { value: 'other', label: t('location_other') },
    { value: 'austria', label: t('location_austria') },
  ];

  const timelineOptions = [
    { value: '1_3', label: t('timeline_1_3') },
    { value: '3_6', label: t('timeline_3_6') },
    { value: 'undecided', label: t('timeline_undecided') },
  ];

  const budgetOptions = [
    { value: 'under500', label: t('budget_under500') },
    { value: '500_1500', label: t('budget_500_1500') },
    { value: 'over1500', label: t('budget_over1500') },
    { value: 'unknown', label: t('budget_unknown') },
  ];

  const nextStep = () => {
    if (step === 1 && form.types.length === 0) {
      setError(t('select_type'));
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/ajanlat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consent, locale, website }),
      });
      // success only when the server says the e-mail was accepted for delivery
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok !== true) throw new Error(`Server error ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section id="quote" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center p-12 rounded-2xl border border-[var(--color-spotlight)]/30 bg-[var(--color-spotlight)]/10">
            <div className="text-5xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {t('success_title')}
            </h2>
            <p className="text-[var(--color-birch)]/80">{t('success_text')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-24 md:py-32 bg-[var(--color-smoke)]/40">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-12">
            <p className="text-[var(--color-spotlight)] text-xs uppercase tracking-[0.4em] mb-4">{t('title')}</p>
            <p className="text-[var(--color-birch)]/70 leading-relaxed">{t('subtitle')}</p>
            <div className="section-divider" />
          </FadeIn>

          <div className="p-8 rounded-2xl border border-[var(--color-walnut)]/40 bg-black/40 backdrop-blur-sm">
            <ProgressBar step={step} />

            <form onSubmit={handleSubmit}>
              {/* Step 1: Project type */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    <span className="text-[var(--color-spotlight)] text-sm mr-2">{t('step_label', { n: 1 })}</span>
                    {t('step1_title')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {projectTypes.map(({ value, label }) => (
                      <TypeButton
                        key={value}
                        label={label}
                        selected={form.types.includes(value)}
                        onClick={() => toggleType(value)}
                      />
                    ))}
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
              )}

              {/* Step 2: Project details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    <span className="text-[var(--color-spotlight)] text-sm mr-2">{t('step_label', { n: 2 })}</span>
                    {t('step2_title')}
                  </h3>
                  <RadioGroup
                    label={t('location_label')}
                    options={locationOptions}
                    value={form.location}
                    onChange={(v) => setForm((f) => ({ ...f, location: v as Location }))}
                  />
                  <RadioGroup
                    label={t('timeline_label')}
                    options={timelineOptions}
                    value={form.timeline}
                    onChange={(v) => setForm((f) => ({ ...f, timeline: v as Timeline }))}
                  />
                  <RadioGroup
                    label={t('budget_label')}
                    options={budgetOptions}
                    value={form.budget}
                    onChange={(v) => setForm((f) => ({ ...f, budget: v as Budget }))}
                    cols2
                  />
                </div>
              )}

              {/* Step 3: Contact */}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    <span className="text-[var(--color-spotlight)] text-sm mr-2">{t('step_label', { n: 3 })}</span>
                    {t('step3_title')}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FieldInput
                      id="quote-name"
                      autoComplete="name"
                      label={t('name')}
                      value={form.name}
                      onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    />
                    <FieldInput
                      id="quote-email"
                      autoComplete="email"
                      label={t('email')}
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    />
                  </div>
                  <FieldInput
                    id="quote-phone"
                    autoComplete="tel"
                    label={t('phone')}
                    type="tel"
                    value={form.phone}
                    onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                  />
                  <div>
                    <label htmlFor="quote-description" className="block text-sm font-medium text-[var(--color-birch)]/80 mb-1.5">
                      {t('description')}
                    </label>
                    <textarea
                      id="quote-description"
                      name="quote-description"
                      required
                      minLength={50}
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder={t('description_placeholder')}
                      className="w-full bg-[var(--color-walnut)]/20 border border-[var(--color-walnut)]/40 rounded-lg px-4 py-3 text-white placeholder-[var(--color-stone)]/70 focus:outline-none focus:border-[var(--color-spotlight)] focus:ring-2 focus:ring-[var(--color-spotlight)]/30 transition-all duration-200 resize-none leading-relaxed"
                    />
                    <p className={`text-xs mt-1 ${form.description.length >= 50 ? 'text-green-400' : 'text-[var(--color-stone)]'}`}>
                      {form.description.length} / 50 min.
                    </p>
                  </div>
                  {/* honeypot: hidden from people and screen readers, bots fill it */}
                  <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="quote-website">Website</label>
                    <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                  <p className="text-xs text-[var(--color-birch)]/70 leading-relaxed">
                    {t.rich('privacy_notice', {
                      link: (chunks) => (
                        <Link href="/adatvedelem" className="text-[var(--color-spotlight)] underline hover:text-white">{chunks}</Link>
                      ),
                    })}
                  </p>
                  <label htmlFor="quote-consent" className="flex items-start gap-3 text-sm text-[var(--color-birch)]/90 cursor-pointer">
                    <input
                      id="quote-consent"
                      name="consent"
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-[var(--color-walnut)] bg-transparent text-[var(--color-spotlight)] focus:ring-[var(--color-spotlight)]"
                    />
                    <span>
                      {t.rich('consent_label', {
                        link: (chunks) => (
                          <Link href="/adatvedelem" className="text-[var(--color-spotlight)] underline hover:text-white">{chunks}</Link>
                        ),
                      })}
                    </span>
                  </label>
                  {status === 'error' && (
                    <p className="text-red-400 text-sm" role="alert">{t('error_text')}</p>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3.5 min-h-[44px] border border-[var(--color-walnut)]/40 text-[var(--color-birch)]/70 rounded-lg hover:bg-[var(--color-walnut)]/20 transition-colors duration-200 text-sm"
                  >
                    {t('back')}
                  </button>
                ) : (
                  <span />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3.5 min-h-[44px] bg-[var(--color-spotlight)] text-[var(--color-stage)] font-semibold rounded-lg hover:bg-[var(--color-oak)] transition-colors duration-200 text-sm"
                  >
                    {t('next')}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'submitting' || form.description.trim().length < 50 || !consent}
                    className="px-8 py-3.5 min-h-[44px] bg-[var(--color-spotlight)] text-[var(--color-stage)] font-bold rounded-lg hover:bg-[var(--color-oak)] transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? t('submitting') : t('submit')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
