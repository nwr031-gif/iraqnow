'use client'

import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

export interface MostReadItem {
  id: string
  slug: string
  title: string
  categoryLabel: string
  views: number
  image?: string
}

interface MostReadProps {
  locale: Locale
  items: MostReadItem[]
}

export function MostRead({ locale, items }: MostReadProps) {
  if (!items || items.length === 0) return null

  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const t = {
    ar: { eyebrow: 'الأكثر قراءة', title: 'الأخبار الأكثر تداولاً', views: 'قراءة' },
    ku: { eyebrow: 'زۆرترین خوێندنەوە', title: 'هەواڵە بەناوبانگەکان', views: 'خوێندنەوە' },
    en: { eyebrow: 'Most Read', title: 'Trending Stories', views: 'views' },
  }[locale]

  return (
    <section className="border-t border-line bg-[var(--background)] py-16 lg:py-24" dir={dir} aria-labelledby="mostread-heading">
      <div className="container-main">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">
            <TrendingUp className="h-3.5 w-3.5" />
            {t.eyebrow}
          </p>
          <h2 id="mostread-heading" className="section-title text-3xl lg:text-4xl">
            {t.title}
          </h2>
        </Reveal>

        <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 2) * 60}>
              <Link
                href={`/${locale}/article/${item.slug}`}
                className="group flex items-center gap-4 border-b border-line py-4 transition-colors"
              >
                <span className="font-kufi text-3xl font-bold tabular-nums text-[var(--muted)] opacity-40 transition-opacity group-hover:opacity-100">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="mb-1 block text-[10px] font-bold text-[var(--muted)]">{item.categoryLabel}</span>
                  <h3 className="font-kufi text-[15px] font-bold leading-snug text-[var(--foreground)] transition-opacity group-hover:opacity-75 line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="mt-1 block text-[10px] text-[var(--muted)]">
                    {item.views.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.views}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
