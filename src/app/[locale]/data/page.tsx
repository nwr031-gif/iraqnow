import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Home, ChevronLeft, Database, Newspaper, Flame, CalendarDays, LayoutGrid, MapPin, Clock, Mic, Users, TrendingUp } from 'lucide-react'
import { Reveal, CountUp } from '@/components/ui/Reveal'
import { BarChart, LineChart } from '@/components/data/Charts'
import { DatasetDownload } from '@/components/data/Interactive'
import { getSiteStats } from '@/lib/data-stats'
import { getGovernorateCounts } from '@/lib/governorate-counts'
import { GOVERNORATES_19 } from '@/lib/governorates'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'العراق بالأرقام — صحافة البيانات',
  description: 'لوحة بيانات حية لمنصة العراق الآن: إحصاءات النشر، توزيع التغطية حسب الأقسام والمحافظات، وقواعد بيانات مفتوحة للتحميل',
  alternates: { languages: { ar: '/ar/data', en: '/en/data' } },
}

const UI: Record<'ar' | 'en', any> = {
  ar: {
    badge: 'صحافة البيانات', title: 'العراق بالأرقام',
    subtitle: 'لوحة بيانات حية من غرفة أخبار العراق الآن — إحصاءات النشر والتغطية محدثة من قاعدة البيانات',
    kpis: 'مؤشرات المنصة',
    totalArticles: 'إجمالي المقالات', thisWeek: 'هذا الأسبوع', breaking: 'أخبار عاجلة',
    categories: 'أقسام مغطاة', governorates: 'محافظات مغطاة', avgReading: 'متوسط وقت القراءة',
    charts: 'الرسوم البيانية', byCategory: 'المقالات حسب القسم', byMonth: 'النشر خلال 6 أشهر',
    latestSection: 'أحدث ما نُشر', viewAll: 'كل الأخبار',
    datasets: 'قواعد البيانات المفتوحة', articlesCsv: 'أرشيف المقالات (CSV)', govCsv: 'التغطية حسب المحافظة (CSV)',
    minutes: 'دقيقة', article: 'مقال', updatedAt: 'آخر تحديث للبيانات', articlesNote: 'العنوان، القسم، التاريخ، القراءات',
    govNote: 'المحافظة وعدد المقالات',
  },
  en: {
    badge: 'Data Journalism', title: 'Iraq in Numbers',
    subtitle: 'A live data dashboard from the Iraq Now newsroom — publishing and coverage stats updated from the database',
    kpis: 'Platform Indicators',
    totalArticles: 'Total Articles', thisWeek: 'This Week', breaking: 'Breaking News',
    categories: 'Sections Covered', governorates: 'Governorates Covered', avgReading: 'Avg. Reading Time',
    charts: 'Charts', byCategory: 'Articles by Section', byMonth: 'Publishing — Last 6 Months',
    latestSection: 'Latest Published', viewAll: 'All News',
    datasets: 'Open Datasets', articlesCsv: 'Articles Archive (CSV)', govCsv: 'Coverage by Governorate (CSV)',
    minutes: 'min', article: 'articles', updatedAt: 'Data last updated', articlesNote: 'Title, section, date, views',
    govNote: 'Governorate and article count',
  },
}

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  politics: { ar: 'السياسة', en: 'Politics' }, economy: { ar: 'الاقتصاد', en: 'Economy' },
  security: { ar: 'الأمن', en: 'Security' }, society: { ar: 'المجتمع', en: 'Society' },
  culture: { ar: 'الثقافة', en: 'Culture' }, sports: { ar: 'الرياضة', en: 'Sports' },
  technology: { ar: 'التكنولوجيا', en: 'Technology' }, health: { ar: 'الصحة', en: 'Health' },
  education: { ar: 'التعليم', en: 'Education' }, environment: { ar: 'البيئة', en: 'Environment' },
  local: { ar: 'محليات', en: 'Local' }, world: { ar: 'العالم', en: 'World' },
}

export default async function DataPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en'
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const numLocale = locale === 'ar' ? 'ar-IQ' : 'en-US'

  const [stats, govCounts] = await Promise.all([getSiteStats(locale), getGovernorateCounts()])

  /* بيانات حقيقية — مع قيم هبوط آمنة قبل أول نشر */
  const totalArticles = stats?.totalArticles ?? 0
  const thisWeek = stats?.thisWeek ?? 0
  const breakingCount = stats?.breakingCount ?? 0
  const avgReading = stats?.avgReadingTime ?? 0
  const categoriesCovered = stats?.categoriesCovered ?? 0
  const governoratesCovered = stats?.governoratesCovered ?? 0

  const catEntries = Object.entries(stats?.byCategory || {}).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const catLabels = catEntries.map(([slug]) => CATEGORY_LABELS[slug]?.[locale] || slug)
  const catValues = catEntries.map(([, v]) => v)

  const monthLabels = (stats?.byMonth || []).map((m) => m.label)
  const monthValues = (stats?.byMonth || []).map((m) => m.count)

  const govRows = GOVERNORATES_19
    .map((g) => ({ name: g[locale], slug: g.slug, count: govCounts ? govCounts[g.slug] || 0 : 0 }))
    .sort((a, b) => b.count - a.count)

  const updatedLabel = stats?.updatedAt
    ? new Date(stats.updatedAt).toLocaleDateString(numLocale, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: t.title,
    description: t.subtitle,
    url: `https://iraqnow.pages.dev/${locale}/data`,
    creator: { '@type': 'Organization', name: 'Iraq Now' },
  }

  const kpis = [
    { icon: Newspaper, value: totalArticles, suffix: '', label: t.totalArticles },
    { icon: CalendarDays, value: thisWeek, suffix: '', label: t.thisWeek },
    { icon: Flame, value: breakingCount, suffix: '', label: t.breaking },
    { icon: LayoutGrid, value: categoriesCovered, suffix: `/${12}`, label: t.categories },
    { icon: MapPin, value: governoratesCovered, suffix: `/${19}`, label: t.governorates },
    { icon: Clock, value: avgReading, suffix: ` ${t.minutes}`, label: t.avgReading },
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
        {/* المؤشرات الحقيقية */}
        <Reveal className="mb-6 flex items-end justify-between">
          <h2 className="section-title text-xl lg:text-2xl">{t.kpis}</h2>
          <p className="text-[11px] text-[var(--muted)]">{t.updatedAt}: {updatedLabel}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kpis.map((kpi, i) => (
            <Reveal key={i} delay={(i % 6) * 50}>
              <div className="group h-full rounded-2xl border border-line bg-[var(--card-bg)] p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)]">
                <span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cream-deep text-[var(--foreground)]">
                  <kpi.icon className="h-4 w-4" />
                </span>
                <p className="font-kufi text-xl font-bold tabular-nums text-[var(--foreground)]">
                  <CountUp end={kpi.value} suffix={kpi.suffix} />
                </p>
                <p className="mt-1 text-[10px] leading-snug text-[var(--muted)]">{kpi.label}</p>
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
                <h3 className="mb-5 flex items-center gap-2 font-kufi text-sm font-bold text-[var(--foreground)]">
                  <TrendingUp className="h-4 w-4 text-[var(--muted)]" />
                  {t.byCategory}
                </h3>
                {catValues.length > 0 ? (
                  <BarChart data={catValues} labels={catLabels} color="#404040" />
                ) : (
                  <p className="py-16 text-center text-sm text-[var(--muted)]">—</p>
                )}
              </div>
            </Reveal>
          </Suspense>

          <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl border border-line bg-cream" />}>
            <Reveal delay={80}>
              <div className="rounded-2xl border border-line bg-[var(--card-bg)] p-5 lg:p-6">
                <h3 className="mb-5 flex items-center gap-2 font-kufi text-sm font-bold text-[var(--foreground)]">
                  <CalendarDays className="h-4 w-4 text-[var(--muted)]" />
                  {t.byMonth}
                </h3>
                <LineChart data={monthValues} labels={monthLabels} color="#737373" />
              </div>
            </Reveal>
          </Suspense>
        </div>

        {/* التغطية حسب المحافظة */}
        <Reveal className="mb-6 mt-14 flex items-end justify-between">
          <h2 className="section-title text-xl lg:text-2xl">{t.govCsv}</h2>
          <Link href={`/${locale}/map`} className="text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
            {locale === 'en' ? '3D Map →' : 'الخريطة 3D ←'}
          </Link>
        </Reveal>
        <Reveal delay={60}>
          <div className="overflow-hidden rounded-2xl border border-line bg-[var(--card-bg)]">
            <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-5">
              {govRows.slice(0, 10).map((g) => (
                <Link
                  key={g.slug}
                  href={`/${locale}/governorate/${g.slug}`}
                  className="flex items-center justify-between gap-2 bg-[var(--card-bg)] px-4 py-3 transition-colors hover:bg-cream"
                >
                  <span className="truncate text-xs font-medium text-[var(--foreground)]">{g.name}</span>
                  <span className="shrink-0 text-xs font-bold tabular-nums text-[var(--muted)]">{g.count.toLocaleString(numLocale)}</span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {/* أحدث ما نُشر */}
        {stats && stats.latest.length > 0 && (
          <>
            <Reveal className="mb-6 mt-14 flex items-end justify-between">
              <h2 className="section-title text-xl lg:text-2xl">{t.latestSection}</h2>
              <Link href={`/${locale}/latest`} className="text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
                {t.viewAll} →
              </Link>
            </Reveal>
            <Reveal delay={60}>
              <div className="overflow-hidden rounded-2xl border border-line bg-[var(--card-bg)]">
                {stats.latest.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 border-b border-line px-4 py-3.5 last:border-0 sm:px-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="hidden shrink-0 text-[10px] font-bold tabular-nums text-[var(--muted)] sm:block">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="truncate text-sm text-[var(--foreground)]">{item.title || '—'}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-cream-deep px-2.5 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                      {CATEGORY_LABELS[item.category]?.[locale] || item.category}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </>
        )}

        {/* قواعد البيانات */}
        <Reveal className="mb-6 mt-14">
          <h2 className="section-title text-xl lg:text-2xl">{t.datasets}</h2>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          <Reveal>
            <DatasetDownload
              name={t.articlesCsv}
              rows={totalArticles}
              size={`${Math.max(1, Math.round(totalArticles / 2))} KB`}
              locale={locale}
              note={t.articlesNote}
              csv={{
                headers: locale === 'en'
                  ? ['Title', 'Section', 'Governorate', 'Published', 'Views', 'Reading (min)']
                  : ['العنوان', 'القسم', 'المحافظة', 'تاريخ النشر', 'القراءات', 'وقت القراءة'],
                rows: (stats?.latest || []).map((a) => [a.title, a.category, '', a.date, a.views, '']),
              }}
            />
          </Reveal>
          <Reveal delay={80}>
            <DatasetDownload
              name={t.govCsv}
              rows={govRows.length}
              size="4 KB"
              locale={locale}
              note={t.govNote}
              csv={{
                headers: locale === 'en' ? ['Governorate', 'Articles'] : ['المحافظة', 'عدد المقالات'],
                rows: govRows.map((g) => [g.name, g.count]),
              }}
            />
          </Reveal>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--muted)]">
          <span className="flex items-center gap-1.5"><Mic className="h-3.5 w-3.5" />{stats?.podcasts ?? 0} {locale === 'en' ? 'podcasts' : 'حلقة بودكاست'}</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{stats?.authors ?? 0} {locale === 'en' ? 'editors' : 'محرراً'}</span>
          <span>{locale === 'en' ? 'All data exported from the Iraq Now database' : 'كل الأرقام مستخرجة من قاعدة بيانات العراق الآن مباشرة'}</span>
        </div>
      </div>
    </div>
  )
}
