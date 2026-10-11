'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Radio, MapPin, Newspaper } from 'lucide-react'
import { IshtarStar } from '@/components/brand/Brand'
import { Reveal } from '@/components/ui/Reveal'

type Locale = 'ar' | 'ku' | 'en'

const UI: Record<Locale, any> = {
  ar: {
    tagline: 'منصة إخبارية عراقية مستقلة', live: 'تغطية مباشرة',
    subtitle: 'أخبار موثقة وتحليلات عميقة من بغداد إلى أربيل والبصرة والموصل — بثلاث لغات',
    latest: 'آخر الأخبار', map: 'الخريطة التفاعلية',
  },
  ku: {
    tagline: 'پلاتفۆرمێکی هەواڵی سەربەخۆی عێراقی', live: 'پەخشی ڕاستەوخۆ',
    subtitle: 'هەواڵی باوەڕپێکراو و شیکاری قووڵ لە بەغدادەوە بۆ هەولێر و بەسرە و موسڵ — بە سێ زمان',
    latest: 'دوایین هەواڵەکان', map: 'نەخشەی بەراوەر',
  },
  en: {
    tagline: 'Independent Iraqi News Platform', live: 'Live Coverage',
    subtitle: 'Verified news and deep analysis from Baghdad to Erbil, Basra and Mosul — in three languages',
    latest: 'Latest News', map: 'Interactive Map',
  },
}

const STATS: Record<Locale, { value: string; label: string }[]> = {
  ar: [
    { value: '18', label: 'محافظة' },
    { value: '3', label: 'لغات' },
    { value: '24/7', label: 'تغطية مستمرة' },
    { value: '12', label: 'قسماً إخبارياً' },
  ],
  ku: [
    { value: '18', label: 'پارێزگا' },
    { value: '3', label: 'زمان' },
    { value: '24/7', label: 'پەخشی بەردەوام' },
    { value: '12', label: 'بەشی هەواڵی' },
  ],
  en: [
    { value: '18', label: 'Governorates' },
    { value: '3', label: 'Languages' },
    { value: '24/7', label: 'Live Coverage' },
    { value: '12', label: 'News Sections' },
  ],
}

export function HeroSection({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const stats = STATS[locale]

  return (
    <section className="relative overflow-hidden bg-lapis-950 text-white" dir={dir} id="top">
      {/* خلفية هادئة */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 start-1/3 h-[420px] w-[420px] rounded-full bg-lapis-600/20 blur-[140px]" />
        <div className="absolute -bottom-32 end-1/4 h-[360px] w-[360px] rounded-full bg-gold-500/[0.07] blur-[120px]" />
      </div>

      <div className="container-main relative py-20 lg:py-28">
        <Reveal className="mb-14 text-center lg:mb-20">
          {/* تسمية علوية */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-sand-100/80 backdrop-blur-sm">
            <IshtarStar size={14} animated />
            {t.tagline}
            <span className="h-3 w-px bg-white/15" />
            <span className="flex items-center gap-1.5 text-red-400">
              <Radio className="h-3 w-3 animate-pulse" />
              {t.live}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl font-kufi text-4xl font-bold leading-[1.2] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {locale === 'ar' ? (
              <>
                <span className="text-gold-gradient">العراق الآن</span>
                <span className="mt-2 block text-2xl font-semibold text-sand-100/85 sm:text-3xl lg:text-4xl">
                  حيث يُروى الخبر كاملاً
                </span>
              </>
            ) : locale === 'ku' ? (
              <>
                <span className="text-gold-gradient">عێراق ئێستا</span>
                <span className="mt-2 block text-2xl font-semibold text-sand-100/85 sm:text-3xl lg:text-4xl">
                  هەواڵ بە تەواوی
                </span>
              </>
            ) : (
              <>
                <span className="text-gold-gradient">Iraq Now</span>
                <span className="mt-2 block text-2xl font-semibold text-sand-100/85 sm:text-3xl lg:text-4xl">
                  The Full Story
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-sand-100/55 sm:text-lg">
            {t.subtitle}
          </p>

          {/* أزرار */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${locale}/latest`} className="btn-gold group inline-flex font-kufi">
              <Newspaper className="h-4 w-4" />
              {t.latest}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href={`/${locale}/map`}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-sand-100/90 transition-all duration-300 hover:border-white/30 hover:bg-white/5 font-kufi"
            >
              <MapPin className="h-4 w-4" />
              {t.map}
            </Link>
          </div>
        </Reveal>

        {/* شريط الإحصائيات */}
        <Reveal delay={200}>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-kufi text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1.5 text-xs text-sand-100/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
