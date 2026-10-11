'use client'

import Link from 'next/link'
import { MapPin, Clock, Eye, Flame } from 'lucide-react'
import { cn, formatRelativeTime, truncate } from '@/lib/utils'

type Locale = 'ar' | 'ku' | 'en'

export interface ArticleData {
  id: string
  slug: string
  breaking: boolean
  featured: boolean
  publishedAt: string
  viewCount: number
  readingTime: number
  translations: Array<{ locale: 'ar' | 'ku' | 'en'; title: string; excerpt: string }>
  media: Array<{ media: { url: string; alt: string } }>
  category?: { slug: string; translations: Array<{ locale: 'ar' | 'ku' | 'en'; name: string }> }
  author?: { name: string; avatar?: string }
  location?: { governorate?: { translations: Array<{ locale: 'ar' | 'ku' | 'en'; name: string }> } }
  image?: string
}

interface ArticleCardProps {
  article: ArticleData
  locale: Locale
  variant?: 'default' | 'compact' | 'featured' | 'horizontal'
}

const BREAKING_LABEL: Record<Locale, string> = { ar: 'عاجل', ku: 'بەپەلە', en: 'Breaking' }

export function ArticleCard({ article, locale, variant = 'default' }: ArticleCardProps) {
  const t = article.translations?.find((tr) => tr.locale === locale) || article.translations?.[0] || { locale, title: '', excerpt: '' }
  const cat = article.category?.translations?.find((tr) => tr.locale === locale) || article.category?.translations?.[0] || { locale, name: '' }
  const loc = article.location?.governorate?.translations?.find((tr) => tr.locale === locale) || article.location?.governorate?.translations?.[0]
  const authorName = article.author?.name || 'العراق الآن'
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const imgUrl = article.media?.[0]?.media?.url || article.image || ''
  const href = `/${locale}/article/${article.slug}`

  /* ─────────── Compact ─────────── */
  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-cream-deep"
        style={{ direction: dir }}
      >
        {imgUrl && (
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
            <img src={imgUrl} alt="" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              {article.breaking && <span className="text-[10px] font-bold text-[var(--foreground)]">{BREAKING_LABEL[locale]}</span>}
              <span className="text-[10px] font-semibold text-[var(--muted)]">{cat.name}</span>
            </div>
            <h4 className="text-[13px] font-semibold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:opacity-70">
              {t.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[var(--muted)]">
            <span>{formatRelativeTime(article.publishedAt, locale)}</span>
          </div>
        </div>
      </Link>
    )
  }

  /* ─────────── Horizontal ─────────── */
  if (variant === 'horizontal') {
    return (
      <article className="group" style={{ direction: dir }}>
        <Link
          href={href}
          className="flex gap-4 rounded-2xl border border-line bg-[var(--card-bg)] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
        >
          {imgUrl && (
            <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
              <img src={imgUrl} alt="" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[var(--muted)]">{cat.name}</span>
                {loc && (
                  <span className="flex items-center gap-0.5 text-[10px] text-[var(--muted)]">
                    <MapPin className="h-3 w-3" />{loc.name}
                  </span>
                )}
              </div>
              <h3 className="font-kufi text-[15px] font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:opacity-70">
                {t.title}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[var(--muted)]">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(article.publishedAt, locale)}</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  /* ─────────── Featured ─────────── */
  if (variant === 'featured') {
    return (
      <article className="group relative" style={{ direction: dir }}>
        <Link href={href} className="relative block aspect-[16/10] overflow-hidden rounded-3xl bg-[var(--foreground)]">
          {imgUrl && (
            <img
              src={imgUrl}
              alt=""
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {article.breaking && (
                <span className="badge badge-live text-[10px] font-bold">
                  <Flame className="h-3 w-3" />
                  {BREAKING_LABEL[locale]}
                </span>
              )}
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {cat.name}
              </span>
            </div>
            <h3 className="mb-2 font-kufi text-xl font-bold leading-snug text-white line-clamp-2 sm:text-2xl">
              {t.title}
            </h3>
            <p className="mb-4 max-w-lg text-sm text-white/60 line-clamp-2">{t.excerpt}</p>
            <div className="flex items-center gap-4 text-[11px] text-white/50">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(article.publishedAt, locale)}</span>
              {loc && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{loc.name}</span>}
            </div>
          </div>
        </Link>
      </article>
    )
  }

  /* ─────────── Default ─────────── */
  return (
    <article className="group h-full" style={{ direction: dir }}>
      <Link
        href={href}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[var(--card-bg)] transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
      >
        {imgUrl && (
          <div className="relative aspect-[16/10] overflow-hidden bg-cream-deep">
            <img
              src={imgUrl}
              alt=""
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {article.breaking && (
              <span className="absolute start-3 top-3 badge badge-live text-[10px] font-bold">
                <Flame className="h-3 w-3" />
                {BREAKING_LABEL[locale]}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2.5 flex items-center gap-2">
            {!imgUrl && article.breaking && (
              <span className="badge badge-live text-[10px] font-bold">
                <Flame className="h-3 w-3" />
                {BREAKING_LABEL[locale]}
              </span>
            )}
            <span className="text-[11px] font-semibold text-[var(--muted)]">{cat.name}</span>
            {loc && (
              <span className="flex items-center gap-0.5 text-[11px] text-[var(--muted)]">
                <MapPin className="h-3 w-3" />
                {loc.name}
              </span>
            )}
          </div>

          <h3 className="mb-2 font-kufi text-[17px] font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors duration-300 group-hover:opacity-70">
            {t.title}
          </h3>

          <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
            {truncate(t.excerpt, 130)}
          </p>

          <div className="flex items-center justify-between border-t border-line pt-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-deep font-kufi text-[10px] font-bold text-[var(--foreground)]">
                {authorName.charAt(0)}
              </span>
              <span className="text-[11px] font-medium text-[var(--muted)]">{authorName}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[var(--muted)]">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(article.publishedAt, locale)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
