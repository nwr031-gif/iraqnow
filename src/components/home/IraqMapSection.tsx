'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Newspaper, Mic, Users, Database, Radio } from 'lucide-react'
import { CountUp, Reveal } from '@/components/ui/Reveal'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { cn } from '@/lib/utils'

type Locale = 'ar' | 'ku' | 'en'

interface MapSectionProps {
  locale: Locale
}

const UI: Record<Locale, any> = {
  ar: {
    badge: 'خريطة العراق التفاعلية',
    title: 'الأخبار على الخريطة',
    subtitle: 'تصفح التغطية حسب المحافظة — من زاخو شمالاً إلى الفاو جنوباً',
    explore: 'استكشف الخريطة الكاملة',
    stats: { governorates: 'محافظة مغطاة', articles: 'خبر يومياً', journalists: 'صحفي ميداني', podcasts: 'بودكاست أسبوعي' },
    hot: 'الأكثر تغطية',
  },
  ku: {
    badge: 'نەخشەی بەراوەری عێراق',
    title: 'هەواڵەکان لەسەر نەخشە',
    subtitle: 'گەڕان بەپێی پارێزگا — لە زاخۆوە بۆ فاو',
    explore: 'نەخشەی تەواو ببینە',
    stats: { governorates: 'پارێزگای پەرپێدراو', articles: 'هەواڵ ڕۆژانە', journalists: 'ڕۆژنامەنووسی مەیدانی', podcasts: 'پۆدکاستی هەفتانە' },
    hot: 'زۆرترین پەرپێدان',
  },
  en: {
    badge: 'Interactive Iraq Map',
    title: 'News on the Map',
    subtitle: 'Browse coverage by governorate — from Zakho in the north to Faw in the south',
    explore: 'Explore Full Map',
    stats: { governorates: 'Governorates Covered', articles: 'Daily Stories', journalists: 'Field Journalists', podcasts: 'Weekly Podcasts' },
    hot: 'Most Covered',
  },
}

const PINS = [
  { id: 'duhok', name: { ar: 'دهوك', ku: 'دهۆک', en: 'Duhok' }, x: 24, y: 12, articles: 156 },
  { id: 'mosul', name: { ar: 'الموصل', ku: 'مۆسڵ', en: 'Mosul' }, x: 33, y: 22, articles: 342 },
  { id: 'erbil', name: { ar: 'أربيل', ku: 'هەولێر', en: 'Erbil' }, x: 44, y: 18, articles: 428 },
  { id: 'sulaymaniyah', name: { ar: 'السليمانية', ku: 'سلێمانی', en: 'Sulaymaniyah' }, x: 55, y: 24, articles: 289 },
  { id: 'kirkuk', name: { ar: 'كركوك', ku: 'کەرکووک', en: 'Kirkuk' }, x: 42, y: 32, articles: 267 },
  { id: 'baghdad', name: { ar: 'بغداد', ku: 'بەغداد', en: 'Baghdad' }, x: 47, y: 48, articles: 1240, hot: true },
  { id: 'anbar', name: { ar: 'الأنبار', ku: 'ئەنبار', en: 'Anbar' }, x: 24, y: 48, articles: 198 },
  { id: 'karbala', name: { ar: 'كربلاء', ku: 'کەربەلا', en: 'Karbala' }, x: 44, y: 60, articles: 234 },
  { id: 'najaf', name: { ar: 'النجف', ku: 'نەجەف', en: 'Najaf' }, x: 43, y: 68, articles: 312 },
  { id: 'basra', name: { ar: 'البصرة', ku: 'بەسرە', en: 'Basra' }, x: 70, y: 86, articles: 456 },
  { id: 'dhi-qar', name: { ar: 'ذي قار', ku: 'زیقار', en: 'Dhi Qar' }, x: 58, y: 76, articles: 221 },
]

export function IraqMapSection({ locale }: MapSectionProps) {
  const t = UI[locale]
  const [active, setActive] = useState<string | null>('baghdad')
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <section className="relative overflow-hidden bg-lapis-950 py-14 text-white lg:py-20" dir={dir} aria-labelledby="map-heading">
      {/* خلفية */}
      <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute -start-40 top-1/4 h-96 w-96 rounded-full bg-lapis-600/20 blur-[120px]" aria-hidden="true" />

      <div className="container-main relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* النص */}
          <Reveal direction={dir === 'rtl' ? 'right' : 'left'}>
            <span className="badge border border-gold-500/30 bg-gold-500/10 text-gold-400">
              <MapPin className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h2 id="map-heading" className="mt-4 font-kufi text-3xl font-bold lg:text-4xl">
              {t.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-sand-100/60">{t.subtitle}</p>

            {/* قائمة المحافظات النشطة */}
            <div className="mt-6 flex flex-wrap gap-2">
              {PINS.slice(0, 7).map((pin) => (
                <button
                  key={pin.id}
                  onMouseEnter={() => setActive(pin.id)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300',
                    active === pin.id
                      ? 'border-gold-500 bg-gold-500/20 text-gold-300'
                      : 'border-white/10 bg-white/5 text-sand-100/60 hover:border-gold-500/40 hover:text-gold-400'
                  )}
                >
                  {pin.name[locale]}
                </button>
              ))}
            </div>

            <Link
              href={`/${locale}/map`}
              className="btn-primary mt-8 inline-flex font-kufi"
            >
              <MapPin className="h-4 w-4" />
              {t.explore}
            </Link>

            {/* الإحصائيات */}
            <CuneiformDivider variant="line" className="mt-10 opacity-50" />

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: MapPin, value: 18, label: t.stats.governorates, suffix: '' },
                { icon: Newspaper, value: 450, label: t.stats.articles, suffix: '+' },
                { icon: Users, value: 120, label: t.stats.journalists, suffix: '+' },
                { icon: Mic, value: 12, label: t.stats.podcasts, suffix: '' },
              ].map((stat, i) => (
                <div key={i} className="group">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400 transition-transform duration-300 group-hover:scale-110">
                    <stat.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="font-kufi text-2xl font-bold text-white">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-0.5 text-[11px] text-sand-100/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* الخريطة */}
          <Reveal direction={dir === 'rtl' ? 'left' : 'right'}>
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              {/* إطار زخرفي */}
              <div className="absolute inset-0 rounded-3xl border border-gold-500/20 bg-gradient-to-br from-lapis-900/80 to-lapis-950/80 p-6 backdrop-blur-sm">
                <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Iraq map">
                  {/* حدود العراق - شكل مبسط */}
                  <defs>
                    <linearGradient id="iraq-fill" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(212,175,55,0.16)" />
                      <stop offset="100%" stopColor="rgba(43,95,171,0.25)" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M22 8 L34 5 L46 10 L56 8 L64 14 L70 24 L74 36 L66 46 L64 56 L70 66 L76 78 L72 90 L62 94 L56 88 L50 78 L40 72 L30 68 L22 58 L14 46 L10 32 L14 18 Z"
                    fill="url(#iraq-fill)"
                    stroke="rgba(212,175,55,0.55)"
                    strokeWidth="0.6"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                  />

                  {/* دجلة والفرات */}
                  <path d="M46 10 C44 26, 48 38, 46 50 C44 62, 50 74, 56 88" stroke="rgba(74,128,201,0.55)" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                  <path d="M38 12 C38 28, 42 42, 44 54 C46 66, 50 76, 56 88" stroke="rgba(74,128,201,0.4)" strokeWidth="0.5" fill="none" strokeLinecap="round" />

                  {/* النقاط */}
                  {PINS.map((pin) => {
                    const isActive = active === pin.id
                    return (
                      <g
                        key={pin.id}
                        onMouseEnter={() => setActive(pin.id)}
                        className="cursor-pointer"
                        transform={`translate(${pin.x} ${pin.y})`}
                      >
                        {pin.hot && (
                          <circle r="4.5" fill="rgba(239,68,68,0.25)" className="animate-ping" />
                        )}
                        <circle
                          r={isActive ? 2.6 : pin.hot ? 2.2 : 1.6}
                          fill={isActive ? '#e2ad31' : pin.hot ? '#ef4444' : '#d4af37'}
                          stroke={isActive ? '#fff' : 'rgba(255,255,255,0.4)'}
                          strokeWidth={isActive ? 0.5 : 0.25}
                          style={{ transition: 'all 0.3s ease' }}
                        />
                        {isActive && (
                          <g transform="translate(0 -6)">
                            <rect x="-13" y="-7" width="26" height="6.5" rx="1.8" fill="rgba(14,13,11,0.92)" stroke="rgba(212,175,55,0.5)" strokeWidth="0.3" />
                            <text textAnchor="middle" fontSize="3.2" fill="#f4dd97" y="-2.2" fontWeight="bold">
                              {pin.name[locale]}
                            </text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                </svg>

                {/* بطاقة معلومات */}
                {active && (
                  <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between rounded-xl border border-gold-500/25 bg-lapis-950/90 px-4 py-3 backdrop-blur-md animate-fade-up">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-kufi text-sm font-bold text-white">
                          {PINS.find((p) => p.id === active)?.name[locale]}
                        </p>
                        <p className="text-[10px] text-sand-100/50">
                          {PINS.find((p) => p.id === active)?.articles} {locale === 'en' ? 'articles this month' : 'خبر هذا الشهر'}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/${locale}/governorate/${active}`}
                      className="rounded-lg bg-gold-500 px-3 py-1.5 text-[11px] font-bold text-lapis-950 transition-transform hover:scale-105"
                    >
                      {locale === 'en' ? 'Browse' : 'تصفح'}
                    </Link>
                  </div>
                )}
              </div>

              {/* نجمة زخرفية دوارة */}
              <div className="absolute -top-3 -end-3 opacity-60">
                <IshtarStar size={40} animated />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
