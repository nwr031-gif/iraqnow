'use client'

import Link from 'next/link'
import { Database, Users, MapPin, TrendingUp, Coins, ArrowLeft, ArrowRight } from 'lucide-react'
import { Reveal, CountUp } from '@/components/ui/Reveal'
import { IRAQ_FACTS } from '@/lib/iraq-data'

type Locale = 'ar' | 'ku' | 'en'

const UI: Record<Locale, any> = {
  ar: {
    badge: 'صحافة البيانات',
    title: 'العراق بالأرقام',
    subtitle: 'مؤشرات الدولة من مصادر رسمية ودولية موثقة — كل رقم بمصدره وتاريخه',
    explore: 'مركز البيانات الكامل',
    kpis: [
      { icon: Users, value: IRAQ_FACTS.population, unit: 'مليون نسمة', label: 'السكان (تعداد 2024)' },
      { icon: MapPin, value: IRAQ_FACTS.area, unit: 'كم²', label: 'المساحة الكلية' },
      { icon: TrendingUp, value: IRAQ_FACTS.gdp, unit: 'مليار دولار', label: 'الناتج المحلي (البنك الدولي 2023)' },
      { icon: Coins, value: IRAQ_FACTS.oilReserves, unit: 'مليار برميل', label: 'الاحتياطي النفطي (أوبك)' },
    ],
    sources: 'المصادر: الجهاز المركزي للإحصاء (تعداد 2024)، البنك الدولي، أوبك، البنك المركزي العراقي',
  },
  ku: {
    badge: 'ڕۆژنامەوانی داتا',
    title: 'عێراق بە ژمارەکان',
    subtitle: 'نیشاندەرەکانی وڵات لە سەرچاوە فەرمی و متمانەپێکراوەکانەوە',
    explore: 'ناوەندی تەواوی داتا',
    kpis: [
      { icon: Users, value: IRAQ_FACTS.population, unit: 'ملیون کەس', label: 'دانیشتووان (سەرژمێری 2024)' },
      { icon: MapPin, value: IRAQ_FACTS.area, unit: 'کم²', label: 'ڕووبەری گشتی' },
      { icon: TrendingUp, value: IRAQ_FACTS.gdp, unit: 'ملیار دۆلار', label: 'بەرهەمی ناوخۆیی' },
      { icon: Coins, value: IRAQ_FACTS.oilReserves, unit: 'ملیار بەرمیل', label: 'یەدەگی نەوت' },
    ],
    sources: 'سەرچاوەکان: دەستەی ناوەندی ئامار، بانکی جیهانی، ئۆپێک',
  },
  en: {
    badge: 'Data Journalism',
    title: 'Iraq in Numbers',
    subtitle: 'Country indicators from official and international sources — every figure with its source and date',
    explore: 'Full Data Center',
    kpis: [
      { icon: Users, value: IRAQ_FACTS.population, unit: 'million people', label: 'Population (2024 census)' },
      { icon: MapPin, value: IRAQ_FACTS.area, unit: 'km²', label: 'Total Area' },
      { icon: TrendingUp, value: IRAQ_FACTS.gdp, unit: 'billion USD', label: 'GDP (World Bank 2023)' },
      { icon: Coins, value: IRAQ_FACTS.oilReserves, unit: 'billion barrels', label: 'Oil Reserves (OPEC)' },
    ],
    sources: 'Sources: Central Statistical Organization (2024 census), World Bank, OPEC, Central Bank of Iraq',
  },
}

export function DataSection({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section className="border-t border-line bg-cream py-14 sm:py-16 lg:py-24" dir={dir} aria-labelledby="data-heading">
      <div className="container-main">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">
              <Database className="h-3.5 w-3.5" />
              {t.badge}
            </p>
            <h2 id="data-heading" className="section-title text-3xl lg:text-4xl">
              {t.title}
            </h2>
            <p className="mt-3 text-[15px] text-[var(--muted)]">{t.subtitle}</p>
          </div>
          <Link
            href={`/${locale}/data`}
            className="group flex items-center gap-2 rounded-full border border-line bg-[var(--card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
          >
            {t.explore}
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {t.kpis.map((kpi: any, i: number) => (
            <Reveal key={i} delay={(i % 4) * 60}>
              <div className="group h-full rounded-2xl border border-line bg-[var(--card-bg)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)] sm:p-5">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cream-deep text-lapis-700">
                  <kpi.icon className="h-5 w-5" />
                </span>
                <p className="font-kufi text-xl font-bold tabular-nums text-[var(--foreground)] sm:text-2xl">
                  <CountUp end={kpi.value} suffix="" />
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-lapis-700">{kpi.unit}</p>
                <p className="mt-1.5 text-[11px] leading-snug text-[var(--muted)]">{kpi.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-[var(--muted)]">{t.sources}</p>
      </div>
    </section>
  )
}
