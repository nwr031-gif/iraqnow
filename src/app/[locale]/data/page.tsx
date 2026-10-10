import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Home, ChevronLeft, Database, Download, TrendingUp, BarChart as ChartIcon, Users, Zap, Droplets, Coins, Landmark } from 'lucide-react'
import { Reveal, CountUp } from '@/components/ui/Reveal'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { BarChart, LineChart, DonutChart } from '@/components/data/Charts'
import { DatasetDownload } from '@/components/data/Interactive'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'العراق بالأرقام — صحافة البيانات',
  description: 'منصة صحافة البيانات العراقية: مؤشرات اقتصادية واجتماعية حية، رسوم تفاعلية، وقواعد بيانات مفتوحة للتحميل',
  alternates: { languages: { ar: '/ar/data', ku: '/ku/data', en: '/en/data' } },
}

const UI: Record<string, any> = {
  ar: {
    badge: 'صحافة البيانات', title: 'العراق بالأرقام',
    subtitle: 'بيانات مفتوحة ورسوم تفاعلية لفهم ما يجري — للباحثين والصحفيين والمواطنين',
    kpis: 'مؤشرات رئيسية', charts: 'الرسوم التفاعلية', datasets: 'قواعد البيانات المفتوحة',
    download: 'تحميل CSV', updated: 'آخر تحديث', sources: 'المصادر: الجهاز المركزي للإحصاء، البنك المركزي العراقي، وزارة النفط، وزارة الكهرباء، وزارة التخطيط',
    oilRevenue: 'الإيرادات النفطية الشهرية (مليار دولار)', dollar: 'سعر صرف الدولار (دينار عراقي)',
    budget: 'توزيع الموازنة الاتحادية 2026',
    exploreAll: 'مكتبة البيانات الكاملة',
  },
  ku: {
    badge: 'ڕۆژنامەوانی داتا', title: 'عێراق بە ژمارەکان',
    subtitle: 'داتای کراوە و گرافە کارلێکەرەکان بۆ تێگەیشتن — بۆ لێکۆڵەرەوان و ڕۆژنامەنووسان',
    kpis: 'نیشاندەرەکانی سەرەکی', charts: 'گرافە کارلێکەرەکان', datasets: 'بنکەدراوەکانی کراوە',
    download: 'CSV دابەزێنە', updated: 'دوایین نوێکردنەوە', sources: 'سەرچاوەکان: دەستەی ناوەندی ئامار، بانکی ناوەندی عێراق',
    oilRevenue: 'داهاتی مانگانەی نەوت ( ملیار دۆلار)', dollar: 'نرخی دۆلار (دیناری عێراقی)',
    budget: 'دابەشکردنی بودجەی فیدراڵی ٢٠٢٦',
    exploreAll: 'کتێبخانەی داتای تەواو',
  },
  en: {
    badge: 'Data Journalism', title: 'Iraq in Numbers',
    subtitle: 'Open data and interactive charts to understand what\'s happening — for researchers, journalists and citizens',
    kpis: 'Key Indicators', charts: 'Interactive Charts', datasets: 'Open Datasets',
    download: 'Download CSV', updated: 'Last updated', sources: 'Sources: Central Statistical Organization, Central Bank of Iraq, Oil Ministry, Planning Ministry',
    oilRevenue: 'Monthly Oil Revenue (Billion USD)', dollar: 'USD Exchange Rate (Iraqi Dinar)',
    budget: 'Federal Budget 2026 Distribution',
    exploreAll: 'Full Data Library',
  },
}

const MONTHS_AR = ['كان2', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'ت1', 'ت2', 'ك1']

const OIL_DATA = [8.2, 8.9, 9.4, 9.1, 9.8, 9.5, 10.2, 10.6, 9.9, 10.4, 11.1, 10.8]
const DOLLAR_DATA = [1310, 1315, 1320, 1310, 1305, 1310, 1312, 1318, 1315, 1310, 1312, 1310]

const BUDGET_SEGMENTS = [
  { label: 'الرواتب والتشغيل', value: 68, color: '#1e4a8c' },
  { label: 'الاستثمار', value: 19, color: '#d4af37' },
  { label: 'الأمن والدفاع', value: 8, color: '#c44224' },
  { label: 'أخرى', value: 5, color: '#6d6b63' },
]

const KPIS = [
  { icon: Users, value: 46.2, suffix: 'M', label: { ar: 'السكان', ku: 'دانیشتووان', en: 'Population' }, trend: '+2.1%', up: true },
  { icon: Coins, value: 264, prefix: '$', suffix: 'B', label: { ar: 'الناتج المحلي', ku: 'داهاتی ناوخۆ', en: 'GDP' }, trend: '+4.2%', up: true },
  { icon: TrendingUp, value: 4.2, suffix: '%', label: { ar: 'التضخم السنوي', ku: 'هەڵاوسان', en: 'Inflation' }, trend: '+0.3%', up: false },
  { icon: Zap, value: 3.4, suffix: 'M', label: { ar: 'صادرات النفط يومياً (برميل)', ku: 'هەناردەی نەوت', en: 'Daily Oil Exports (bbl)' }, trend: '+120K', up: true },
  { icon: Droplets, value: 15.5, suffix: '%', label: { ar: 'معدل البطالة', ku: 'ڕێژەی بێکاری', en: 'Unemployment' }, trend: '-1.2%', up: true },
  { icon: Landmark, value: 18.5, suffix: 'h', label: { ar: 'ساعات تجهيز الكهرباء', ku: 'کاتژمێری کارەبا', en: 'Electricity Hours' }, trend: '+2.1h', up: true },
]

const DATASETS = [
  { name: { ar: 'الموازنة العامة 2026', ku: 'بودجەی گشتی', en: 'General Budget 2026' }, rows: 1240, size: '2.4 MB', icon: Landmark },
  { name: { ar: 'أسعار الصرف اليومية', ku: 'نرخەکانی دۆلار', en: 'Daily Exchange Rates' }, rows: 3650, size: '890 KB', icon: Coins },
  { name: { ar: 'إحصاءات الكهرباء الشهرية', ku: 'ئاماری کارەبا', en: 'Monthly Electricity Stats' }, rows: 216, size: '310 KB', icon: Zap },
  { name: { ar: 'التعداد السكاني 2024', ku: 'سەرژمێری ٢٠٢٤', en: 'Census 2024' }, rows: 8900, size: '12 MB', icon: Users },
]

export default async function DataPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as 'ar' | 'ku' | 'en'
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: t.title,
    description: t.subtitle,
    url: `https://iraqnow.pages.dev/${locale}/data`,
    creator: { '@type': 'Organization', name: 'Iraq Now' },
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* الرأس */}
      <section className="relative overflow-hidden bg-lapis-950 py-14 text-white lg:py-20">
        <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-20 start-1/3 h-72 w-72 rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="container-main relative">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-sand-100/50">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-400">
              <Home className="h-3.5 w-3.5" />
              {locale === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="font-medium text-gold-400">{t.title}</span>
          </nav>

          <Reveal className="text-center">
            <span className="badge mx-auto mb-5 border border-gold-500/30 bg-gold-500/10 text-gold-400">
              <Database className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h1 className="font-kufi text-3xl font-bold lg:text-5xl">
              <span className="text-gold-gradient">{t.title}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-sand-100/60 lg:text-base">{t.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <div className="container-main py-10">
        {/* المؤشرات */}
        <Reveal>
          <h2 className="section-title mb-6 font-kufi text-xl font-bold lg:text-2xl">{t.kpis}</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {KPIS.map((kpi, i) => (
            <Reveal key={i} delay={(i % 6) * 60}>
              <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
                <span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/12 text-gold-600">
                  <kpi.icon className="h-4.5 w-4.5" />
                </span>
                <p className="font-kufi text-xl font-bold text-[var(--foreground)]">
                  {kpi.prefix || ''}<CountUp end={kpi.value} suffix={kpi.suffix} />{kpi.suffix === '%' ? '' : ''}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-[var(--muted)]">{kpi.label[locale]}</p>
                <p className={`mt-1.5 text-[10px] font-bold ${kpi.up ? 'text-green-600' : 'text-terra-600'}`}>{kpi.trend}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* الرسوم */}
        <Reveal>
          <h2 className="section-title mb-6 mt-14 font-kufi text-xl font-bold lg:text-2xl">{t.charts}</h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl bg-[var(--card-bg)]" />}>
            <Reveal>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
                <h3 className="mb-5 flex items-center gap-2 font-kufi text-sm font-bold text-[var(--foreground)]">
                  <ChartIcon className="h-4 w-4 text-gold-500" />
                  {t.oilRevenue}
                </h3>
                <BarChart data={OIL_DATA} labels={MONTHS_AR} color="#d4af37" />
              </div>
            </Reveal>
          </Suspense>

          <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl bg-[var(--card-bg)]" />}>
            <Reveal delay={80}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
                <h3 className="mb-5 flex items-center gap-2 font-kufi text-sm font-bold text-[var(--foreground)]">
                  <TrendingUp className="h-4 w-4 text-lapis-500" />
                  {t.dollar}
                </h3>
                <LineChart data={DOLLAR_DATA} labels={MONTHS_AR} color="#4a80c9" />
              </div>
            </Reveal>
          </Suspense>
        </div>

        <Reveal>
          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
            <h3 className="mb-6 flex items-center gap-2 font-kufi text-sm font-bold text-[var(--foreground)]">
              <Landmark className="h-4 w-4 text-gold-500" />
              {t.budget}
            </h3>
            <DonutChart segments={BUDGET_SEGMENTS} centerValue="2026" centerLabel={locale === 'en' ? 'Budget' : 'الموازنة'} />
          </div>
        </Reveal>

        {/* قواعد البيانات */}
        <Reveal>
          <h2 className="section-title mb-6 mt-14 font-kufi text-xl font-bold lg:text-2xl">{t.datasets}</h2>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {DATASETS.map((ds, i) => (
            <Reveal key={i} delay={(i % 2) * 80}>
              <DatasetDownload
                name={ds.name[locale]}
                rows={ds.rows}
                size={ds.size}
                locale={locale}
              />
            </Reveal>
          ))}
        </div>

        <CuneiformDivider variant="star" className="my-12 opacity-40" />

        <p className="text-center text-[11px] leading-relaxed text-[var(--muted)]">{t.sources}</p>
      </div>
    </div>
  )
}


