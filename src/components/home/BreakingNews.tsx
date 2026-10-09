'use client'

import Link from 'next/link'
import { Flame } from 'lucide-react'

type Locale = 'ar' | 'ku' | 'en'

interface BreakingNewsProps {
  locale: Locale
}

const BREAKING = [
  {
    id: '1',
    slug: 'breaking-1',
    title: { ar: 'مجلس الوزراء يعقد جلسة استثنائية لمناقشة الموازنة', ku: 'ئەنجومەنی وەزیران کۆبوونەوەی نائاسایی ئەنجام دەدات', en: 'Cabinet Holds Emergency Session on Budget' },
    category: { ar: 'سياسة', ku: 'سیاسەت', en: 'Politics' },
  },
  {
    id: '2',
    slug: 'breaking-2',
    title: { ar: 'البنك المركزي يعلن إجراءات جديدة لدعم الدينار العراقي', ku: 'بانکی ناوەندی ڕێکارە نوێیەکان بۆ پشتگیری دینار ڕادەگەیەنێت', en: 'Central Bank Announces New Measures to Support the Dinar' },
    category: { ar: 'اقتصاد', ku: 'ئابووری', en: 'Economy' },
  },
  {
    id: '3',
    slug: 'breaking-3',
    title: { ar: 'افتتاح أكبر محطة للطاقة الشمسية في البصرة بقدرة 1000 ميغاواط', ku: 'گەورەترین وێستگەی وزەی خۆر لە بەسرە دەکرێتەوە', en: 'Largest Solar Plant Opens in Basra with 1000MW Capacity' },
    category: { ar: 'طاقة', ku: 'وزە', en: 'Energy' },
  },
  {
    id: '4',
    slug: 'breaking-4',
    title: { ar: 'منتخب العراق يتأهل لنهائيات كأس آسيا بعد فوز تاريخي', ku: 'هەڵبژاردەی عێراق بۆ کۆتایی جامی ئاسیا سەرکەوت', en: 'Iraq Qualifies for Asian Cup Final After Historic Win' },
    category: { ar: 'رياضة', ku: 'وەرزش', en: 'Sports' },
  },
  {
    id: '5',
    slug: 'breaking-5',
    title: { ar: 'إطلاق أول قطار كهربائي بين بغداد والموصل العام المقبل', ku: 'یەکەم شەمەندەفەری کارەبایی نێوان بەغداد و موسڵ دەستپێدەکات', en: 'First Electric Train Between Baghdad and Mosul Launches Next Year' },
    category: { ar: 'بنية تحتية', ku: 'ژێرخان', en: 'Infrastructure' },
  },
]

export function BreakingNews({ locale }: BreakingNewsProps) {
  const doubled = [...BREAKING, ...BREAKING]

  return (
    <section
      className="relative overflow-hidden border-b border-gold-500/15 bg-gradient-to-l from-lapis-950 via-lapis-900 to-lapis-950"
      aria-label="Breaking news"
    >
      <div className="container-main">
        <div className="flex items-center gap-4 py-3">
          {/* شارة عاجل */}
          <div className="relative flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-l from-red-600 to-red-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-900/40">
            <span className="absolute inset-0 animate-pulse rounded-lg bg-red-500/40" />
            <Flame className="relative h-4 w-4" />
            <span className="relative font-kufi tracking-wide">
              {locale === 'ar' ? 'عاجل' : locale === 'ku' ? 'بەپەلە' : 'BREAKING'}
            </span>
          </div>

          {/* الشريط المتحرك */}
          <div className="relative flex-1 overflow-hidden" dir="ltr">
            {/* تلاشي جانبي */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-lapis-950 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-lapis-950 to-transparent" />

            <div className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
              {doubled.map((news, i) => (
                <Link
                  key={`${news.id}-${i}`}
                  href={`/${locale}/article/${news.slug}`}
                  dir={locale === 'en' ? 'ltr' : 'rtl'}
                  className="group flex shrink-0 items-center gap-3 text-sm"
                >
                  <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  <span className="shrink-0 rounded-md bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-400">
                    {news.category[locale]}
                  </span>
                  <span className="whitespace-nowrap font-medium text-sand-100/85 transition-colors group-hover:text-gold-300">
                    {news.title[locale]}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* حالة البث */}
          <div className="hidden shrink-0 items-center gap-2 text-[11px] text-sand-100/50 md:flex">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              {locale === 'en' ? 'Auto-refresh' : 'تحديث تلقائي'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
