'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Landmark, TrendingUp, Shield, Users, Palette, Trophy, Cpu, HeartPulse, GraduationCap, Leaf, MapPin, Globe } from 'lucide-react'
import { ArticleCard, type ArticleData } from './ArticleCard'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'
import { cn } from '@/lib/utils'

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
  ar: { badge: 'الأقسام', title: 'تصفح حسب الاهتمام', subtitle: '12 قسماً متخصصاً تغطي كل ما يهم العراقي', articles: 'خبر', more: 'المزيد' },
  ku: { badge: 'بەشەکان', title: 'بەپێی بایەخ بگەڕێ', subtitle: '١٢ بەشی تایبەت بە هەموو ئەوەی عێراقی گرنگە', articles: 'هەواڵ', more: 'زیاتر' },
  en: { badge: 'Sections', title: 'Browse by Interest', subtitle: '12 specialized sections covering everything Iraqis care about', articles: 'stories', more: 'More' },
}

export function CategoryShowcase({ locale }: CategoryShowcaseProps) {
  const t = UI[locale]
  const labels = LABELS[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <section className="relative overflow-hidden py-14 lg:py-20" dir={dir} aria-labelledby="categories-heading">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] ziggurat-steps" aria-hidden="true" />

      <div className="container-main relative">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="badge badge-gold mb-3">
              <IshtarStar size={12} />
              {t.badge}
            </span>
            <h2 id="categories-heading" className="font-kufi text-3xl font-bold lg:text-4xl">
              {t.title}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{t.subtitle}</p>
          </div>
        </Reveal>

        {/* شبكة الأقسام */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon
            const count = [1240, 890, 567, 723, 445, 612, 334, 289, 198, 156, 876, 432][i]
            return (
              <Reveal key={cat.slug} delay={(i % 4) * 70}>
                <Link
                  href={`/${locale}/category/${cat.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all duration-400 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-xl hover:shadow-lapis-900/10"
                >
                  {/* خلفية زخرفية عند التحويم */}
                  <div className="absolute -end-6 -top-6 opacity-0 transition-all duration-500 group-hover:opacity-10 group-hover:rotate-12">
                    <Icon className="h-24 w-24 text-gold-500" />
                  </div>

                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-700 to-lapis-950 text-gold-400 shadow-md shadow-lapis-900/20 transition-transform duration-400 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="font-kufi text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-gold-600">
                    {labels[cat.slug]}
                  </h3>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">
                    {count.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.articles}
                  </p>

                  <span className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-gold-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {t.more}
                    {dir === 'rtl' ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                  </span>

                  <span className="absolute bottom-0 start-0 h-1 w-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500 group-hover:w-full" />
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
