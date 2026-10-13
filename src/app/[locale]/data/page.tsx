import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Home, ChevronLeft, Database, Landmark, Users, MapPin, Coins, TrendingUp, Globe, Clock, CalendarDays, ExternalLink } from 'lucide-react'
import { Reveal, CountUp } from '@/components/ui/Reveal'
import { BarChart, DonutChart } from '@/components/data/Charts'
import { DatasetDownload } from '@/components/data/Interactive'
import { IRAQ_FACTS, GOV_POPULATION, GOV_POPULATION_SOURCE, BUDGET_MIX, BUDGET_MIX_SOURCE } from '@/lib/iraq-data'
import { arabicMonth } from '@/lib/format'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'العراق بالأرقام — مؤشرات الدولة',
  description: 'مركز بيانات العراق: السكان، المساحة، الاقتصاد، النفط، والمحافظات — بأرقام من مصادر رسمية ودولية موثقة مع ذكر المصدر وتاريخ كل بيانة',
  alternates: { languages: { ar: '/ar/data', en: '/en/data' } },
}

const UI: Record<'ar' | 'en', any> = {
  ar: {
    badge: 'صحافة البيانات', title: 'العراق بالأرقام',
    subtitle: 'مؤشرات الدولة وأساسياتها من مصادر رسمية ودولية موثقة — كل رقم محمّل بمصدره وتاريخه',
    kpis: 'مؤشرات الدولة',
    population: 'السكان', area: 'المساحة الكلية', governorates: 'المحافظات',
    gdp: 'الناتج المحلي الإجمالي', oilReserves: 'الاحتياطي النفطي المؤكد', exchange: 'سعر الصرف الرسمي',
    million: 'مليون نسمة', km2: 'كم²', billionDollar: 'مليار دولار', barrels: 'مليار برميل', dinar: 'د.ع / دولار',
    charts: 'الرسوم البيانية', govPopulation: 'سكان أكبر المحافظات', budgetMix: 'تركيبة إيرادات الموازنة الاتحادية',
    countryInfo: 'بطاقة الدولة',
    capital: 'العاصمة', currency: 'العملة', timezone: 'التوقيت الرسمي', language: 'اللغة الرسمية',
    languageVal: 'العربية (والكردية رسمية في المناطق المختصة)',
    datasets: 'قواعد البيانات المفتوحة', govCsv: 'بيانات المحافظات (CSV)', govNote: 'المحافظة وعدد سكانها التقديري بالمليون',
    sourcesNote: 'منهجية جمع البيانات: تُجمع الأرقام من جهات رسمية (الجهاز المركزي للإحصاء، البنك المركزي العراقي) وجهات دولية موثوقة (البنك الدولي، أوبك)، وتُعرض مدورة مع ذكر المصدر وسنة كل بيانة. الأرقام التقديرية قد تختلف بين المصادر.',
    dataDate: 'آخر مراجعة للبيانات', dataDateVal: 'تشرين الأول 2026',
    sourcesTitle: 'المصادر المعتمدة',
    sourcesList: [
      'الجهاز المركزي للإحصاء — التعداد العام للسكان 2024',
      'البنك الدولي — مؤشرات التنمية العالمية',
      'البنك المركزي العراقي — أسعار الصرف الرسمية',
      'منظمة أوبك — التقرير السنوي للاحتياطيات المؤكدة',
    ],
  },
  en: {
    badge: 'Data Journalism', title: 'Iraq in Numbers',
    subtitle: 'Country indicators from official and international sources — every figure carries its source and date',
    kpis: 'Country Indicators',
    population: 'Population', area: 'Total Area', governorates: 'Governorates',
    gdp: 'GDP', oilReserves: 'Proven Oil Reserves', exchange: 'Official Exchange Rate',
    million: 'million people', km2: 'km²', billionDollar: 'billion USD', barrels: 'billion barrels', dinar: 'IQD / USD',
    charts: 'Charts', govPopulation: 'Largest Governorates by Population', budgetMix: 'Federal Revenue Composition',
    countryInfo: 'Country Card',
    capital: 'Capital', currency: 'Currency', timezone: 'Official Timezone', language: 'Official Language',
    languageVal: 'Arabic (Kurdish official in designated regions)',
    datasets: 'Open Datasets', govCsv: 'Governorates Data (CSV)', govNote: 'Governorate and estimated population in millions',
    sourcesNote: 'Methodology: figures are collected from official bodies (Central Statistical Organization, Central Bank of Iraq) and reliable international sources (World Bank, OPEC), presented rounded with source and year of each figure.',
    dataDate: 'Data last reviewed', dataDateVal: 'October 2026',
    sourcesTitle: 'Sources',
    sourcesList: [
      'Central Statistical Organization — 2024 National Census',
      'World Bank — World Development Indicators',
      'Central Bank of Iraq — Official Exchange Rates',
      'OPEC — Annual Report on Proven Reserves',
    ],
  },
}

const LAST_UPDATED = 'تشرين الأول 2026'

export default async function DataPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en'
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const numLocale = locale === 'ar' ? 'ar-IQ' : 'en-US'

  const govLabels = GOV_POPULATION.map((g) => (locale === 'en' ? g.en : g.ar))
  const govValues = GOV_POPULATION.map((g) => g.population)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: t.title,
    description: t.subtitle,
    url: `https://iraqnow.pages.dev/${locale}/data`,
    creator: { '@type': 'Organization', name: 'Iraq Now' },
  }

  const kpis = [
    { icon: Users, value: IRAQ_FACTS.population, suffix: '', unit: t.million, label: t.population, source: IRAQ_FACTS.populationSource },
    { icon: MapPin, value: IRAQ_FACTS.area, suffix: '', unit: t.km2, label: t.area, source: 'الجهاز المركزي للإحصاء' },
    { icon: Globe, value: IRAQ_FACTS.governorates, suffix: '', unit: '', label: t.governorates, source: 'أُقرت حلبجة محافظة عام 2014' },
    { icon: TrendingUp, value: IRAQ_FACTS.gdp, suffix: '', unit: t.billionDollar, label: t.gdp, source: IRAQ_FACTS.gdpSource },
    { icon: Database, value: IRAQ_FACTS.oilReserves, suffix: '', unit: t.barrels, label: t.oilReserves, source: IRAQ_FACTS.oilReservesSource },
    { icon: Coins, value: IRAQ_FACTS.exchangeRate, suffix: '', unit: t.dinar, label: t.exchange, source: IRAQ_FACTS.exchangeSource },
  ]

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* الرأس */}
      <section className="border-b border-line bg-[var(--background)] py-12 lg:py-16">
        <div className="container-main">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-[var(--muted)]">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]">
              <Home className="h-3.5 w-3.5" />
              {locale === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="font-medium text-[var(--foreground)]">{t.title}</span>
          </nav>

          <Reveal className="text-center">
            <span className="badge badge-lapis mx-auto mb-5">
              <Database className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h1 className="font-kufi text-3xl font-bold tracking-tight lg:text-5xl">{t.title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--muted)] lg:text-base">{t.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <div className="container-main py-10 lg:py-14">
        {/* مؤشرات الدولة */}
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-title text-xl lg:text-2xl">{t.kpis}</h2>
          <p className="text-[11px] text-[var(--muted)]">{t.dataDate}: {t.dataDateVal}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kpis.map((kpi, i) => (
            <Reveal key={i} delay={(i % 6) * 50}>
              <div className="group h-full rounded-2xl border border-line bg-[var(--card-bg)] p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)]">
                <span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cream-deep text-lapis-700">
                  <kpi.icon className="h-4 w-4" />
                </span>
                <p className="font-kufi text-xl font-bold tabular-nums text-[var(--foreground)]">
                  <CountUp end={kpi.value} suffix={kpi.suffix} />
                </p>
                <p className="mt-1 text-[10px] font-semibold text-lapis-700">{kpi.unit}</p>
                <p className="mt-1 text-[10px] leading-snug text-[var(--muted)]">{kpi.label}</p>
                <p className="mt-2 border-t border-line pt-2 text-[9px] leading-snug text-[var(--muted)] opacity-70">{kpi.source}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* الرسوم الحقيقية */}
        <Reveal className="mb-6 mt-14">
          <h2 className="section-title text-xl lg:text-2xl">{t.charts}</h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl border border-line bg-cream" />}>
            <Reveal>
              <div className="rounded-2xl border border-line bg-[var(--card-bg)] p-5 lg:p-6">
                <h3 className="mb-1 flex items-center gap-2 font-kufi text-sm font-bold text-[var(--foreground)]">
                  <Users className="h-4 w-4 text-[var(--muted)]" />
                  {t.govPopulation}
                </h3>
                <p className="mb-4 text-[10px] text-[var(--muted)]">{GOV_POPULATION_SOURCE} — الوحدة: مليون نسمة</p>
                <BarChart data={govValues} labels={govLabels} color="#183a6f" />
              </div>
            </Reveal>
          </Suspense>

          <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl border border-line bg-cream" />}>
            <Reveal delay={80}>
              <div className="rounded-2xl border border-line bg-[var(--card-bg)] p-5 lg:p-6">
                <h3 className="mb-1 flex items-center gap-2 font-kufi text-sm font-bold text-[var(--foreground)]">
                  <Landmark className="h-4 w-4 text-[var(--muted)]" />
                  {t.budgetMix}
                </h3>
                <p className="mb-4 text-[10px] text-[var(--muted)]">{BUDGET_MIX_SOURCE} — الوحدة: نسبة مئوية</p>
                <DonutChart segments={BUDGET_MIX} centerValue={`${IRAQ_FACTS.oilRevenueShare}%`} centerLabel={locale === 'en' ? 'Oil revenue' : 'نفطية'} />
              </div>
            </Reveal>
          </Suspense>
        </div>

        {/* بطاقة الدولة */}
        <Reveal className="mb-6 mt-14">
          <h2 className="section-title text-xl lg:text-2xl">{t.countryInfo}</h2>
        </Reveal>
        <Reveal delay={60}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            {[
              { icon: MapPin, k: t.capital, v: locale === 'en' ? IRAQ_FACTS.capitalEn : IRAQ_FACTS.capital },
              { icon: Coins, k: t.currency, v: IRAQ_FACTS.currency },
              { icon: Clock, k: t.timezone, v: IRAQ_FACTS.timezone },
              { icon: Globe, k: t.language, v: t.languageVal },
            ].map((row, i) => (
              <div key={i} className="bg-[var(--card-bg)] p-5">
                <row.icon className="mb-3 h-5 w-5 text-lapis-600" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">{row.k}</p>
                <p className="mt-1 text-sm font-bold text-[var(--foreground)]">{row.v}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* قواعد البيانات */}
        <Reveal className="mb-6 mt-14">
          <h2 className="section-title text-xl lg:text-2xl">{t.datasets}</h2>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          <Reveal>
            <DatasetDownload
              name={t.govCsv}
              rows={GOV_POPULATION.length}
              size="2 KB"
              locale={locale}
              note={t.govNote}
              csv={{
                headers: locale === 'en' ? ['Governorate', 'Population (millions, est. 2024 census)'] : ['المحافظة', 'عدد السكان بالمليون (تقدير التعداد 2024)'],
                rows: GOV_POPULATION.map((g) => [locale === 'en' ? g.en : g.ar, g.population]),
              }}
            />
          </Reveal>
          <Reveal delay={80}>
            <DatasetDownload
              name={locale === 'en' ? 'Revenue Composition (CSV)' : 'تركيبة الإيرادات (CSV)'}
              rows={BUDGET_MIX.length}
              size="1 KB"
              locale={locale}
              note={BUDGET_MIX_SOURCE}
              csv={{
                headers: locale === 'en' ? ['Revenue Type', 'Share %'] : ['نوع الإيراد', 'النسبة %'],
                rows: BUDGET_MIX.map((b) => [b.label, b.value]),
              }}
            />
          </Reveal>
        </div>

        {/* المصادر والمنهجية */}
        <Reveal className="mt-14 rounded-2xl border border-line bg-cream p-6">
          <h3 className="mb-4 flex items-center gap-2 font-kufi text-sm font-bold text-[var(--foreground)]">
            <ExternalLink className="h-4 w-4 text-lapis-600" />
            {t.sourcesTitle}
          </h3>
          <ul className="space-y-2">
            {t.sourcesList.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-[var(--muted)]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-[11px] leading-relaxed text-[var(--muted)]">
            {t.sourcesNote}
          </p>
          <p className="mt-3 text-[11px] font-semibold text-[var(--muted)]">
            {t.dataDate}: {LAST_UPDATED} ({arabicMonth(new Date().getMonth())} {new Date().getFullYear()})
          </p>
        </Reveal>
      </div>
    </div>
  )
}
