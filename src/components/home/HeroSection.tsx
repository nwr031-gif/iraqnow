'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Radio, MapPin, Newspaper, Users } from 'lucide-react'
import { IshtarStar } from '@/components/brand/Brand'
import { Reveal } from '@/components/ui/Reveal'

type Locale = 'ar' | 'ku' | 'en'

const UI: Record<Locale, any> = {
  ar: {
    tagline: 'صوت العراق الحقيقي', live: 'تغطية مباشرة',
    subtitle: 'تغطية شاملة ومستقلة من بغداد إلى أربيل والبصرة والموصل — بثلاث لغات',
    explore: 'تصفح الأقسام', map: 'الخريطة التفاعلية', data: 'العراق بالأرقام',
    latest: 'آخر التحديثات',
  },
  ku: {
    tagline: 'دەنگی ڕاستەقینەی عێراق', live: 'پەخشی ڕاستەوخۆ',
    subtitle: 'پەرپێدانی گشتگیر و سەربەخۆ لە بەغدادەوە بۆ هەولێر و بەسرە و موسڵ — بە سێ زمان',
    explore: 'گەڕان بەدوای بەشەکان', map: 'نەخشەی بەراوەر', data: 'عێراق بە ژمارەکان',
    latest: 'دوایین نوێکردنەوەکان',
  },
  en: {
    tagline: 'The True Voice of Iraq', live: 'Live Coverage',
    subtitle: 'Comprehensive, independent coverage from Baghdad to Erbil, Basra and Mosul — in three languages',
    explore: 'Browse Sections', map: 'Interactive Map', data: 'Iraq in Numbers',
    latest: 'Latest Updates',
  },
}

const STATS: Record<Locale, any[]> = {
  ar: [
    { value: '18', label: 'محافظة' },
    { value: '3', label: 'لغات' },
    { value: '24/7', label: 'تغطية مستمرة' },
    { value: '120+', label: 'صحفي' },
  ],
  ku: [
    { value: '18', label: 'پارێزگا' },
    { value: '3', label: 'زمان' },
    { value: '24/7', label: 'پەخشی بەردەوام' },
    { value: '120+', label: 'ڕۆژنامەنووس' },
  ],
  en: [
    { value: '18', label: 'Governorates' },
    { value: '3', label: 'Languages' },
    { value: '24/7', label: 'Live Coverage' },
    { value: '120+', label: 'Journalists' },
  ],
}

export function HeroSection({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const stats = STATS[locale]

  return (
    <section className="relative overflow-hidden bg-lapis-950 text-white" dir={dir} id="top">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
                <g fill='none' stroke='%23d4af37' stroke-opacity='0.10' stroke-width='1.2'>
                  <path d='M20 20 L30 26 L20 32'/>
                  <path d='M60 20 L70 26 L60 32'/>
                  <path d='M100 20 L110 26 L100 32'/>
                  <path d='M20 60 L30 66 L20 72'/>
                  <path d='M60 60 L70 66 L60 72'/>
                  <path d='M100 60 L110 66 L100 72'/>
                  <path d='M20 100 L30 106 L20 112'/>
                  <path d='M60 100 L70 106 L60 112'/>
                  <path d='M100 100 L110 106 L100 112'/>
                  <circle cx='40' cy='46' r='2.5'/>
                  <circle cx='80' cy='46' r='2.5'/>
                  <circle cx='40' cy='86' r='2.5'/>
                  <circle cx='80' cy='86' r='2.5'/>
                </g>
              </svg>
            `)}")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-lapis-950/40 via-transparent to-lapis-950" />
        <div className="absolute -top-32 start-1/4 h-96 w-96 rounded-full bg-lapis-600/25 blur-[120px]" />
        <div className="absolute -bottom-20 end-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-[100px]" />
      </div>

      <div className="container-main relative py-16 lg:py-24">
        <Reveal className="mb-12 text-center lg:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-2 text-xs font-semibold text-gold-400 backdrop-blur-sm">
            <IshtarStar size={16} animated />
            {t.tagline}
            <span className="mx-1 h-3 w-px bg-gold-500/30" />
            <span className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              {t.live}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl font-kufi text-4xl font-bold leading-[1.15] text-balance sm:text-5xl lg:text-6xl">
            {locale === 'ar' ? (
              <>
                <span className="text-gold-gradient">العراق الآن</span>
                <span className="mx-3 text-sand-100/30">|</span>
                <span className="text-sand-100">حيث يُروى الخبر كاملاً</span>
              </>
            ) : locale === 'ku' ? (
              <>
                <span className="text-gold-gradient">عێراق ئێستا</span>
                <span className="mx-3 text-sand-100/30">|</span>
                <span className="text-sand-100">هەواڵ بە تەواوی</span>
              </>
            ) : (
              <>
                <span className="text-gold-gradient">Iraq Now</span>
                <span className="mx-3 text-sand-100/30">|</span>
                <span className="text-sand-100">The Full Story</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-sand-100/60 sm:text-lg">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${locale}/latest`} className="btn-primary group inline-flex font-kufi">
              <Newspaper className="h-4 w-4" />
              {t.latest}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link href={`/${locale}/map`} className="btn-outline !border-white/20 !text-sand-100 group inline-flex font-kufi hover:!bg-gold-500 hover:!text-lapis-950">
              <MapPin className="h-4 w-4" />
              {t.map}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-10 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="group text-center">
                <p className="font-kufi text-3xl font-bold text-gold-gradient sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs text-sand-100/50 transition-colors group-hover:text-sand-100/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="relative h-6 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0 14px, rgba(212,175,55,0.25) 14px 16px, transparent 16px 30px)`,
          }}
        />
      </div>
    </section>
  )
}
