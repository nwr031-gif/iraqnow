'use client'

import Link from 'next/link'
import { Flame, TrendingUp, ArrowUp, ArrowDown, Minus, Hash } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'
import { cn } from '@/lib/utils'

type Locale = 'ar' | 'ku' | 'en'

const UI: Record<Locale, any> = {
  ar: { badge: 'الترند', title: 'المواضيع الأكثر تداولاً', subtitle: 'ما يتحدث عنه العراق الآن', all: 'كل المواضيع', talk: '{n} حديث' },
  ku: { badge: 'ترێند', title: 'بابەتە زۆرترین باسکراوەکان', subtitle: 'ئەوەی عێراق ئێستا باسی دەکات', all: 'هەموو بابەتەکان', talk: '{n} گفتوگۆ' },
  en: { badge: 'Trending', title: 'Most Discussed Topics', subtitle: 'What Iraq is talking about now', all: 'All Topics', talk: '{n} mentions' },
}

const TOPICS = [
  { rank: 1, slug: 'elections', label: { ar: 'انتخابات المحافظات', ku: 'هەڵبژاردنی پارێزگاکان', en: 'Provincial Elections' }, mentions: 12400, change: 24, hot: true },
  { rank: 2, slug: 'dinar', label: { ar: 'سعر صرف الدينار', ku: 'نرخی دینار', en: 'Dinar Exchange Rate' }, mentions: 9800, change: 18, hot: true },
  { rank: 3, slug: 'budget-2027', label: { ar: 'موازنة 2027', ku: 'بودجەی ٢٠٢٧', en: '2027 Budget' }, mentions: 7600, change: -5, hot: false },
  { rank: 4, slug: 'asian-cup', label: { ar: 'كأس آسيا', ku: 'جامی ئاسیا', en: 'Asian Cup' }, mentions: 6900, change: 41, hot: true },
  { rank: 5, slug: 'baghdad-metro', label: { ar: 'مترو بغداد', ku: 'مێترۆی بەغداد', en: 'Baghdad Metro' }, mentions: 5200, change: 12, hot: false },
  { rank: 6, slug: 'water-crisis', label: { ar: 'أزمة المياه', ku: 'قەیرانی ئاو', en: 'Water Crisis' }, mentions: 4800, change: 8, hot: false },
  { rank: 7, slug: 'faw-port', label: { ar: 'ميناء الفاو', ku: 'بەندەری فاو', en: 'Faw Port' }, mentions: 3900, change: -2, hot: false },
  { rank: 8, slug: 'solar-energy', label: { ar: 'الطاقة الشمسية', ku: 'وزەی خۆر', en: 'Solar Energy' }, mentions: 3400, change: 33, hot: true },
]

export function TrendingTopics({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <section className="relative py-14 lg:py-20" dir={dir} aria-labelledby="trending-heading">
      <div className="container-main">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="badge badge-terra mb-3">
                <Flame className="h-3.5 w-3.5" />
                {t.badge}
              </span>
              <h2 id="trending-heading" className="section-title font-kufi text-3xl font-bold lg:text-4xl">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{t.subtitle}</p>
            </div>
            <Link
              href={`/${locale}/trending`}
              className="rounded-xl border border-gold-500/40 px-5 py-2.5 text-sm font-semibold text-gold-600 transition-all duration-300 hover:bg-gold-500 hover:text-lapis-950"
            >
              {t.all}
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((topic, i) => {
            const ChangeIcon = topic.change > 0 ? ArrowUp : topic.change < 0 ? ArrowDown : Minus
            const changeColor = topic.change > 0 ? 'text-green-500' : topic.change < 0 ? 'text-red-500' : 'text-[var(--muted)]'
            return (
              <Reveal key={topic.slug} delay={(i % 4) * 70}>
                <Link
                  href={`/${locale}/topic/${topic.slug}`}
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl',
                    topic.hot
                      ? 'border-terra-500/30 bg-gradient-to-br from-terra-500/[0.07] to-transparent hover:border-terra-500/50'
                      : 'border-[var(--border)] bg-[var(--card-bg)] hover:border-gold-500/40'
                  )}
                >
                  {/* الرقم */}
                  <span className="pointer-events-none absolute -top-2 end-3 font-kufi text-6xl font-black text-[var(--foreground)] opacity-[0.05] transition-opacity duration-400 group-hover:opacity-[0.09]">
                    {topic.rank}
                  </span>

                  <div className="relative mb-3 flex items-center justify-between">
                    <span className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg font-kufi text-sm font-bold',
                      topic.hot ? 'bg-terra-500/15 text-terra-600' : 'bg-gold-500/15 text-gold-600'
                    )}>
                      {topic.hot ? <Flame className="h-4 w-4" /> : <Hash className="h-3.5 w-3.5" />}
                    </span>
                    <span className={cn('flex items-center gap-1 text-xs font-bold', changeColor)}>
                      <ChangeIcon className="h-3.5 w-3.5" />
                      {Math.abs(topic.change)}%
                    </span>
                  </div>

                  <h3 className="relative font-kufi text-[15px] font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:text-gold-600">
                    {topic.label[locale]}
                  </h3>

                  <div className="relative mt-auto flex items-center gap-2 pt-4 text-[11px] text-[var(--muted)]">
                    <TrendingUp className="h-3.5 w-3.5 text-gold-500" />
                    {topic.mentions.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {locale === 'en' ? 'mentions' : locale === 'ku' ? 'گفتوگۆ' : 'حديث'}
                  </div>

                  <span className={cn(
                    'absolute bottom-0 start-0 h-1 w-0 transition-all duration-500 group-hover:w-full',
                    topic.hot ? 'bg-gradient-to-r from-terra-400 to-terra-600' : 'bg-gradient-to-r from-gold-400 to-gold-600'
                  )} />
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
