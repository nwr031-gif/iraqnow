'use client'

import Link from 'next/link'
import { TrendingUp, Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrendingTopicsProps {
  locale: 'ar' | 'ku' | 'en'
}

const mockTrending = [
  { id: '1', topic: { ar: 'انتخابات مجالس المحافظات', ku: 'هەڵبژاردنەکانی شۆڕشگەری پارێزگا', en: 'Provincial Council Elections' }, count: 1250, change: 15, category: 'politics' },
  { id: '2', topic: { ar: 'موازنة 2027 الفيدرالية', ku: 'بەджێتی ٢٠٢٧ فیدراڵ', en: '2027 Federal Budget' }, count: 980, change: -5, category: 'economy' },
  { id: '3', topic: { ar: 'مشروع مترو بغداد', ku: 'پڕۆژەی مێترۆی بەغداد', en: 'Baghdad Metro Project' }, count: 875, change: 22, category: 'local' },
  { id: '4', topic: { ar: 'قمة المناخ في البصرة', ku: 'سەرۆکایەتی کەش و ھەوای بەصرە', en: 'Basra Climate Summit' }, count: 720, change: 8, category: 'environment' },
  { id: '5', topic: { ar: 'قانون النفط والغاز الجديد', ku: 'یاسای نوێی نەفت و گاز', en: 'New Oil & Gas Law' }, count: 650, change: -12, category: 'economy' },
  { id: '6', topic: { ar: 'عودة النازحين إلى سنجار', ku: 'وەستانی کوچبەرەکان بۆ شنگال', en: 'IDPs Return to Sinjar' }, count: 590, change: 30, category: 'society' },
  { id: '7', topic: { ar: 'تأهل العراق لكأس آسيا', ku: 'سەرکەوتنی عێراق بۆ کاسێ ئاسیا', en: 'Iraq Qualifies for Asian Cup' }, count: 1100, change: 45, category: 'sports' },
  { id: '8', topic: { ar: 'إطلاق منصة حكومية رقمية', ku: 'دەستپێکردنی پلاتفۆرمێکی هەواڵاتی دیجیتاڵ', en: 'Digital Gov Platform Launch' }, count: 480, change: 3, category: 'technology' },
]

export function TrendingTopics({ locale }: TrendingTopicsProps) {
  return (
    <section className="py-8 lg:py-12 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="trending-heading">
      <div className="container-main">
        <div className="flex items-center justify-between mb-6">
          <h2 id="trending-heading" className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <TrendingUp className="h-6 w-6 text-accent" />
            {locale === 'ar' ? 'المواضيع الرائجة' : locale === 'ku' ? 'بابەتە ترینـدەکان' : 'Trending Topics'}
          </h2>
          <Link
            href={`/${locale}/trending`}
            className="text-sm font-medium text-accent hover:underline"
          >
            {locale === 'ar' ? 'عرض الكل' : locale === 'ku' ? 'ھەمووی پیشان بدە' : 'View All'}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockTrending.map((item, index) => {
            const ChangeIcon = item.change > 0 ? ArrowUp : item.change < 0 ? ArrowDown : Minus
            const changeColor = item.change > 0 ? 'text-success' : item.change < 0 ? 'text-error' : 'text-gray-500'
            return (
              <Link
                key={item.id}
                href={`/${locale}/topic/${item.id}`}
                className="card p-4 group relative overflow-hidden"
              >
                <div className="absolute top-2 left-2 text-3xl font-bold text-gray-200 dark:text-gray-700 font-mono">
                  {index + 1}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="h-4 w-4 text-accent" />
                    <span className={cn('text-xs font-bold', changeColor)}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                    {item.topic[locale] || item.topic.ar}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <ChangeIcon className={cn('h-3 w-3', changeColor)} />
                      {Math.abs(item.change)}%
                    </span>
                    <span>{item.count.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}