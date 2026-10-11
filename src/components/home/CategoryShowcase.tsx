'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Landmark, TrendingUp, Shield, Users, Palette, Trophy, Cpu, HeartPulse, GraduationCap, Leaf, MapPin, Globe } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

interface CategoryShowcaseProps {
  locale: Locale
}

const CATEGORIES = [
  { slug: 'politics', icon: Landmark },
  { slug: 'economy', icon: TrendingUp },
  { slug: 'security', icon: Shield },
  { slug: 'society', icon: Users },
  { slug: 'culture', icon: Palette },
  { slug: 'sports', icon: Trophy },
  { slug: 'technology', icon: Cpu },
  { slug: 'health', icon: HeartPulse },
  { slug: 'education', icon: GraduationCap },
  { slug: 'environment', icon: Leaf },
  { slug: 'local', icon: MapPin },
  { slug: 'world', icon: Globe },
] as const

const LABELS: Record<Locale, Record<string, string>> = {
  ar: { politics: 'السياسة', economy: 'الاقتصاد', security: 'الأمن', society: 'المجتمع', culture: 'الثقافة', sports: 'الرياضة', technology: 'التكنولوجيا', health: 'الصحة', education: 'التعليم', environment: 'البيئة', local: 'محليات', world: 'العالم' },
  ku: { politics: 'سیاسەت', economy: 'ئابووری', security: 'ئاسایش', society: 'کۆمەڵگە', culture: 'چاند', sports: 'وەرزش', technology: 'تەکنەلۆژی', health: 'تەندروستی', education: 'پەروەردە', environment: 'ژینگە', local: 'ناوخۆ', world: 'جیهان' },
  en: { politics: 'Politics', economy: 'Economy', security: 'Security', society: 'Society', culture: 'Culture', sports: 'Sports', technology: 'Technology', health: 'Health', education: 'Education', environment: 'Environment', local: 'Local', world: 'World' },
}

const UI: Record<Locale, any> = {
  ar: { eyebrow: 'الأقسام', title: 'تصفح حسب الاهتمام', subtitle: 'اثنا عشر قسماً متخصصاً تغطي كل ما يهم العراقي', browse: 'تصفح' },
  ku: { eyebrow: 'بەشەکان', title: 'بەپێی بایەخ بگەڕێ', subtitle: 'دوازدە بەشی تایبەت بۆ هەموو ئەوەی عێراقی گرنگە', browse: 'گەڕان' },
  en: { eyebrow: 'Sections', title: 'Browse by Interest', subtitle: 'Twelve specialized sections covering everything Iraqis care about', browse: 'Browse' },
}

export function CategoryShowcase({ locale }: CategoryShowcaseProps) {
  const t = UI[locale]
  const labels = LABELS[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section className="py-16 lg:py-24" dir={dir} aria-labelledby="categories-heading">
      <div className="container-main">
        <Reveal>
          <div className="mb-12 max-w-xl">
            <p className="eyebrow mb-3">
              <IshtarStar size={12} />
              {t.eyebrow}
            </p>
            <h2 id="categories-heading" className="section-title text-3xl lg:text-4xl">
              {t.title}
            </h2>
            <p className="mt-3 text-[15px] text-[var(--muted)]">{t.subtitle}</p>
          </div>
        </Reveal>

        {/* شبكة الأقسام */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon
            return (
              <Reveal key={cat.slug} delay={(i % 4) * 60}>
                <Link
                  href={`/${locale}/category/${cat.slug}`}
                  className="group flex h-full items-center gap-3.5 rounded-2xl border border-line bg-[var(--card-bg)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-deep text-[var(--foreground)] transition-colors duration-300 group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)]">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-kufi text-sm font-bold text-[var(--foreground)]">
                      {labels[cat.slug]}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--muted)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {t.browse}
                      <Arrow className="h-3 w-3" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
