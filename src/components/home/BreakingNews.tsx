'use client'

import Link from 'next/link'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

type Locale = 'ar' | 'ku' | 'en'

export interface BreakingItem {
  id: string
  slug: string
  title: string
  categoryLabel: string
}

interface BreakingNewsProps {
  locale: Locale
  items: BreakingItem[]
}

export function BreakingNews({ locale, items }: BreakingNewsProps) {
  if (!items || items.length === 0) return null

  /* مكرر مرتين لضمان استمرارية الحركة الأفقية */
  const doubled = [...items, ...items]

  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]"
      aria-label={locale === 'en' ? 'Breaking news' : 'الأخبار العاجلة'}
    >
      <div className="container-main">
        <div className="flex items-center gap-4 py-2.5">
          {/* شارة عاجل */}
          <div className="relative flex shrink-0 items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black">
            <Flame className="h-3.5 w-3.5" />
            <span className="font-kufi tracking-wide">
              {locale === 'ar' ? 'عاجل' : locale === 'ku' ? 'بەپەلە' : 'BREAKING'}
            </span>
          </div>

          {/* الشريط المتحرك */}
          <div className="relative flex-1 overflow-hidden" dir="ltr">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent" />

            <div className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
              {doubled.map((news, i) => (
                <Link
                  key={`${news.id}-${i}`}
                  href={`/${locale}/article/${news.slug}`}
                  dir={locale === 'en' ? 'ltr' : 'rtl'}
                  className="group flex shrink-0 items-center gap-3 text-sm"
                >
                  <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                  <span className="shrink-0 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/60">
                    {news.categoryLabel}
                  </span>
                  <span className="whitespace-nowrap font-medium text-white/90 transition-colors group-hover:text-white">
                    {news.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
