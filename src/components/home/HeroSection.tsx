'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Radio, MapPin, Newspaper } from 'lucide-react'
import { IshtarStar } from '@/components/brand/Brand'
import { Reveal } from '@/components/ui/Reveal'

type Locale = 'ar' | 'ku' | 'en'

const UI: Record<Locale, any> = {
  ar: {
    tagline: 'منصة إخبارية عراقية مستقلة', live: 'تغطية مباشرة',
    subtitle: 'أخبار موثقة وتحليلات عميقة من بغداد إلى أربيل والبصرة والموصل — بلغتين',
    latest: 'آخر الأخبار', map: 'الخريطة التفاعلية',
  },
  ku: {
    tagline: 'پلاتفۆرمێکی هەواڵی سەربەخۆی عێراقی', live: 'پەخشی ڕاستەوخۆ',
    subtitle: 'هەواڵی باوەڕپێکراو و شیکاری قووڵ لە بەغدادەوە بۆ هەولێر و بەسرە و موسڵ — بە دوو زمان',
    latest: 'دوایین هەواڵەکان', map: 'نەخشەی بەراوەر',
  },
  en: {
    tagline: 'Independent Iraqi News Platform', live: 'Live Coverage',
    subtitle: 'Verified news and deep analysis from Baghdad to Erbil, Basra and Mosul — in two languages',
    latest: 'Latest News', map: 'Interactive Map',
  },
}

export function HeroSection({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section className="relative overflow-hidden border-b border-line bg-[var(--background)] text-[var(--foreground)]" dir={dir} id="top">
      <div className="container-main relative py-14 sm:py-20 lg:py-28">
        <Reveal className="mb-10 text-center sm:mb-14 lg:mb-20">
          {/* تسمية علوية */}
          <div className="mb-7 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-line bg-cream px-3 py-1.5 text-[11px] font-medium text-[var(--muted)] sm:px-4 sm:text-xs">
            <IshtarStar size={14} animated />
            {t.tagline}
            <span className="h-3 w-px bg-line-strong" />
            <span className="flex items-center gap-1.5 text-[var(--foreground)]">
              <Radio className="h-3 w-3 animate-pulse" />
              {t.live}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl font-kufi text-4xl font-bold leading-[1.2] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {locale === 'ar' ? (
              <>
                <span className="text-gold-gradient">العراق الآن</span>
                <span className="mt-2 block text-2xl font-semibold text-[var(--muted)] sm:text-3xl lg:text-4xl">
                  حيث يُروى الخبر كاملاً
                </span>
              </>
            ) : locale === 'ku' ? (
              <>
                <span className="text-gold-gradient">عێراق ئێستا</span>
                <span className="mt-2 block text-2xl font-semibold text-[var(--muted)] sm:text-3xl lg:text-4xl">
                  هەواڵ بە تەواوی
                </span>
              </>
            ) : (
              <>
                <span className="text-gold-gradient">Iraq Now</span>
                <span className="mt-2 block text-2xl font-semibold text-[var(--muted)] sm:text-3xl lg:text-4xl">
                  The Full Story
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {t.subtitle}
          </p>

          {/* أزرار */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${locale}/latest`} className="btn-gold group inline-flex font-kufi">
              <Newspaper className="h-4 w-4" />
              {t.latest}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link href={`/${locale}/map`} className="btn-outline group inline-flex font-kufi">
              <MapPin className="h-4 w-4" />
              {t.map}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
