'use client'

import Link from 'next/link'
import { Database, Download, TrendingUp, ArrowLeft, ArrowRight, ChartColumn, FileText, ExternalLink } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

type Locale = 'ar' | 'ku' | 'en'

const UI: Record<Locale, any> = {
  ar: {
    badge: 'صحافة البيانات',
    title: 'العراق بالأرقام',
    subtitle: 'بيانات مفتوحة ورسوم تفاعلية لفهم ما يجري — للباحثين والصحفيين والمواطنين',
    explore: 'تصفح مكتبة البيانات',
    download: 'تحميل CSV',
    sources: 'المصادر: الجهاز المركزي للإحصاء، البنك المركزي العراقي، وزارة التخطيط',
    updated: 'آخر تحديث',
    datasets: 'قاعدة بيانات',
    investigations: 'تحقيق بياناتي',
  },
  ku: {
    badge: 'رۆژنامەوانی داتا',
    title: 'عێراق بە ژمارەکان',
    subtitle: 'داتای کراوە و نەخشەی کارلێکەر بۆ تێگەیشتنی ڕووداوەکان',
    explore: 'کتێبخانەی داتا ببینە',
    download: 'CSV دابەزێنە',
    sources: 'سەرچاوەکان: دەستەی ناوەندی ئامار، بانکی ناوەندی عێراق',
    updated: 'دوایین نوێکردنەوە',
    datasets: 'بنکەدراوە',
    investigations: 'لێکۆڵینەوەی داتا',
  },
  en: {
    badge: 'Data Journalism',
    title: 'Iraq in Numbers',
    subtitle: 'Open data and interactive charts to understand what\'s happening — for researchers, journalists and citizens',
    explore: 'Browse Data Library',
    download: 'Download CSV',
    sources: 'Sources: Central Statistical Organization, Central Bank of Iraq, Ministry of Planning',
    updated: 'Last updated',
    datasets: 'Datasets',
    investigations: 'Data Investigations',
  },
}

const DATASETS = [
  { id: 'inflation', name: { ar: 'التضخم الشهري', ku: 'هەڵاوسانی مانگانە', en: 'Monthly Inflation' }, value: '4.2%', trend: '+0.3', format: 'percent' },
  { id: 'oil', name: { ar: 'صادرات النفط', ku: 'هەناردەکردنی نەوت', en: 'Oil Exports' }, value: '3.4M', trend: '+120K', format: 'barrels' },
  { id: 'jobs', name: { ar: 'معدل البطالة', ku: 'ڕێژەی بێکاری', en: 'Unemployment' }, value: '15.5%', trend: '-1.2', format: 'percent' },
  { id: 'electricity', name: { ar: 'ساعات تجهيز الكهرباء', ku: 'کاتژمێری کارەبا', en: 'Electricity Hours' }, value: '18.5h', trend: '+2.1', format: 'hours' },
]

const BARS = [42, 58, 35, 72, 61, 88, 54, 67, 79, 45, 92, 70]

export function DataSection({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section className="relative overflow-hidden py-14 lg:py-20" dir={dir} aria-labelledby="data-heading">
      {/* خلفية داكنة زجاجية */}
      <div className="absolute inset-0 bg-gradient-to-br from-lapis-900 via-lapis-950 to-ink-950" aria-hidden="true" />
      <div className="absolute inset-0 ishtar-grid opacity-30" aria-hidden="true" />

      <div className="container-main relative text-white">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="badge border border-gold-500/30 bg-gold-500/10 text-gold-400 mb-3">
                <Database className="h-3.5 w-3.5" />
                {t.badge}
              </span>
              <h2 id="data-heading" className="font-kufi text-3xl font-bold lg:text-4xl">
                {t.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm text-sand-100/60">{t.subtitle}</p>
            </div>
            <Link
              href={`/${locale}/data`}
              className="group flex items-center gap-2 rounded-xl border border-gold-500/40 px-5 py-2.5 text-sm font-semibold text-gold-400 transition-all duration-300 hover:bg-gold-500 hover:text-lapis-950"
            >
              {t.explore}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* الرسم البياني */}
          <Reveal className="lg:col-span-2">
            <div className="glass-card h-full p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
                    <ChartColumn className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-kufi text-sm font-bold">
                      {locale === 'en' ? 'Monthly Oil Revenue (Billions USD)' : locale === 'ku' ? 'داهاتی مانگانەی نەوت' : 'الإيرادات النفطية الشهرية (مليار دولار)'}
                    </h3>
                    <p className="text-[11px] text-sand-100/50">
                      {t.updated}: {new Date().toLocaleDateString(locale === 'ar' ? 'ar-IQ' : locale === 'ku' ? 'ckb-IQ' : 'en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg border border-gold-500/30 px-3 py-1.5 text-[11px] font-semibold text-gold-400 transition-colors hover:bg-gold-500/10">
                  <Download className="h-3.5 w-3.5" />
                  {t.download}
                </button>
              </div>

              {/* أعمدة */}
              <div className="flex h-48 items-end justify-between gap-2">
                {BARS.map((h, i) => (
                  <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="rounded bg-gold-500/10 px-1.5 py-0.5 text-[9px] font-bold text-gold-400 opacity-0 transition-opacity group-hover:opacity-100">
                      {h}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-lapis-600 to-gold-500/80 transition-all duration-500 group-hover:from-gold-600 group-hover:to-gold-400"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-sand-100/40">
                      {['ك2', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'ت1', 'ت2', 'ك1'][i]}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-5 border-t border-white/10 pt-3 text-[10px] text-sand-100/40">{t.sources}</p>
            </div>
          </Reveal>

          {/* مؤشرات سريعة */}
          <div className="flex flex-col gap-4">
            {DATASETS.map((ds, i) => (
              <Reveal key={ds.id} delay={i * 80}>
                <div className="glass-card group flex items-center justify-between p-4 transition-all duration-300 hover:border-gold-500/40">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lapis-700/60 text-gold-400">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-sand-100/70">{ds.name[locale]}</p>
                      <p className="font-kufi text-lg font-bold text-white">{ds.value}</p>
                    </div>
                  </div>
                  <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${ds.trend.startsWith('+') ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                    {ds.trend}
                  </span>
                </div>
              </Reveal>
            ))}

            <Reveal delay={320}>
              <Link
                href={`/${locale}/data/library`}
                className="group flex items-center justify-between rounded-2xl border border-gold-500/25 bg-gold-500/10 p-4 transition-all duration-300 hover:bg-gold-500/20"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gold-400" />
                  <span className="text-sm font-semibold text-gold-300">
                    {locale === 'en' ? '142 open datasets' : locale === 'ku' ? '١٤٢ بنکەدراوەی کراوە' : '142 قاعدة بيانات مفتوحة'}
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-gold-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
