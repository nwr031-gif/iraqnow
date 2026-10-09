'use client'

import Link from 'next/link'
import { Flame, MapPin, Clock, Eye } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface BreakingNewsProps {
  locale: 'ar' | 'ku' | 'en'
}

const mockBreakingNews = [
  { id: '1', slug: 'breaking-1', title: { ar: 'رئيس الوزراء يعلن حالة الطوارئ الاقتصادية', ku: 'سەرۆک وەزیر دژوور دەکرێت بۆ پهێنای ئابووری', en: 'PM Declares Economic Emergency' }, category: { ar: 'السياسة', ku: 'سیاسەت', en: 'Politics' }, time: '5 دقائق', views: 25000, breaking: true },
  { id: '2', slug: 'breaking-2', title: { ar: 'انفجار في سوق شعبي ببغداد يسفر عن إصابات', ku: 'تەقینەوەیەک لە بازاڕی گشتی بەغداد', en: 'Explosion in Baghdad Market' }, category: { ar: 'الأمن', ku: 'ئاسایش', en: 'Security' }, time: '12 دقائق', views: 18000, breaking: true },
  { id: '3', slug: 'breaking-3', title: { ar: 'سعر صرف الدولار ينخفض لأول مرة منذ شهور', ku: 'نرخی دۆلار دابەش دەکات بۆ یەکەم جار', en: 'Dollar Rate Drops for First Time in Months' }, category: { ar: 'الاقتصاد', ku: 'أپووری', en: 'Economy' }, time: '25 دقائق', views: 32000, breaking: true },
  { id: '4', slug: 'breaking-4', title: { ar: 'منتخب العراق يتأهل لنهائيات كأس آسيا', ku: 'تیمی عێراق سەرکەوتوو دەبێت بۆ کۆتایی ئاسیا', en: 'Iraq Qualifies for Asian Cup Finals' }, category: { ar: 'الرياضة', ku: 'وەرزش', en: 'Sports' }, time: '40 دقائق', views: 45000, breaking: true },
]

export function BreakingNews({ locale }: BreakingNewsProps) {
  const t = mockBreakingNews[0].title[locale] || mockBreakingNews[0].title.ar
  const cat = mockBreakingNews[0].category[locale] || mockBreakingNews[0].category.ar

  return (
    <section className="border-y border-gray-200 bg-error/5 dark:bg-error/10" aria-label="Breaking News">
      <div className="container-main">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex-shrink-0 flex items-center gap-2 rounded-lg bg-error px-3 py-1 text-sm font-bold text-white animate-pulse">
            <Flame className="h-4 w-4" />
            {locale === 'ar' ? 'عاجل' : locale === 'ku' ? 'بەھێز' : 'BREAKING'}
          </div>
          <marquee behavior="scroll" direction={locale === 'en' ? 'left' : 'right'} scrollAmount={2} onMouseOver={(e) => e.currentTarget.stop()} onMouseOut={(e) => e.currentTarget.start()}>
            <div className="flex whitespace-nowrap gap-8">
              {mockBreakingNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/${locale}/article/${news.slug}`}
                  className="flex-shrink-0 flex items-center gap-3 text-sm font-medium text-gray-900 hover:text-accent dark:text-white dark:hover:text-accent"
                >
                  <span className="text-accent font-bold">●</span>
                  <span className="text-gray-600 dark:text-gray-400">[{news.category[locale] || news.category.ar}]</span>
                  <span>{news.title[locale] || news.title.ar}</span>
                </Link>
              ))}
              {mockBreakingNews.map((news) => (
                <Link
                  key={`repeat-${news.id}`}
                  href={`/${locale}/article/${news.slug}`}
                  className="flex-shrink-0 flex items-center gap-3 text-sm font-medium text-gray-900 hover:text-accent dark:text-white dark:hover:text-accent"
                >
                  <span className="text-accent font-bold">●</span>
                  <span className="text-gray-600 dark:text-gray-400">[{news.category[locale] || news.category.ar}]</span>
                  <span>{news.title[locale] || news.title.ar}</span>
                </Link>
              ))}
            </div>
          </marquee>
        </div>
      </div>
    </section>
  )
}