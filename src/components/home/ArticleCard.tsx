'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Eye, Bookmark, Share2, Flame } from 'lucide-react'
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
}

interface ArticleCardProps {
  article: ArticleData
  locale: Locale
  variant?: 'default' | 'compact' | 'featured' | 'horizontal'
}

const READ_LABELS: Record<Locale, string> = { ar: 'دقيقة قراءة', ku: 'خولەک خوێندنەوە', en: 'min read' }

export function ArticleCard({ article, locale, variant = 'default' }: ArticleCardProps) {
  const t = article.translations?.find((tr) => tr.locale === locale) || article.translations?.[0] || { locale, title: '', excerpt: '' }
  const cat = article.category?.translations?.find((tr) => tr.locale === locale) || article.category?.translations?.[0] || { locale, name: '' }
  const loc = article.location?.governorate?.translations?.find((tr) => tr.locale === locale) || article.location?.governorate?.translations?.[0]
  const authorName = article.author?.name || 'العراق الآن'
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const hasImage = (article.media?.length || 0) > 0
  const img = hasImage ? article.media[0].media : null

  /* ─────────── Compact ─────────── */
  if (variant === 'compact') {
    return (
      <Link
        href={`/${locale}/article/${article.slug}`}
        className="group flex gap-3 rounded-xl p-2 transition-all duration-300 hover:bg-gold-500/5"
        style={{ direction: dir }}
      >
        {img && (
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
            <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              {article.breaking && <span className="text-[10px] font-bold text-red-500">{locale === 'en' ? 'LIVE' : 'عاجل'}</span>}
              <span className="text-[10px] font-semibold text-gold-600">{cat.name}</span>
            </div>
            <h4 className="text-[13px] font-semibold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:text-gold-600">
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
        <Link href={`/${locale}/article/${article.slug}`} className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-3 transition-all duration-400 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-xl hover:shadow-lapis-900/10">
          {img && (
            <div className="img-zoom relative h-28 w-36 shrink-0 overflow-hidden rounded-xl">
              <Image src={img.url} alt={img.alt} fill sizes="144px" className="object-cover" />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="badge badge-gold !px-2 !py-0.5 text-[10px]">{cat.name}</span>
                {loc && (
                  <span className="flex items-center gap-0.5 text-[10px] text-[var(--muted)]">
                    <MapPin className="h-3 w-3" />{loc.name}
                  </span>
                )}
              </div>
              <h3 className="font-kufi text-[15px] font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:text-gold-600">
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
        <Link href={`/${locale}/article/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-3xl border border-gold-500/20">
          {img && (
            <Image src={img.url} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition-transform duration-[1.1s] group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-lapis-950 via-lapis-950/45 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {article.breaking && (
                <span className="badge badge-live text-[10px] font-bold">
                  <Flame className="h-3 w-3" />
                  {locale === 'en' ? 'LIVE' : 'عاجل'}
                </span>
              )}
              <span className="badge border border-white/20 bg-white/10 text-white backdrop-blur-sm">{cat.name}</span>
            </div>
            <h3 className="mb-2 font-kufi text-xl font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-gold-300 sm:text-2xl">
              {t.title}
            </h3>
            <p className="mb-4 max-w-lg text-sm text-sand-100/70 line-clamp-2">{t.excerpt}</p>
            <div className="flex items-center gap-4 text-[11px] text-sand-100/60">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(article.publishedAt, locale)}</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}</span>
              {loc && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{loc.name}</span>}
            </div>
          </div>
        </Link>
      </article>
    )
  }

  /* ─────────── Default ─────────── */
  return (
    <article className="group" style={{ direction: dir }}>
      <Link
        href={`/${locale}/article/${article.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] transition-all duration-400 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-2xl hover:shadow-lapis-900/15"
      >
        {img && (
          <div className="img-zoom relative aspect-[16/10] overflow-hidden">
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-lapis-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

            <div className="absolute start-3 top-3 flex gap-2">
              {article.breaking && (
                <span className="badge badge-live !px-2.5 !py-1 text-[10px] font-bold">
                  <Flame className="h-3 w-3" />
                  {locale === 'en' ? 'LIVE' : 'عاجل'}
                </span>
              )}
            </div>

            {/* زر الحفظ يظهر عند التمرير */}
            <div className="absolute end-3 top-3 flex translate-y-2 gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-ink-800 shadow-lg backdrop-blur-sm transition-colors hover:bg-gold-500 hover:text-white dark:bg-ink-900/90 dark:text-sand-100"
                aria-label="حفظ"
                onClick={(e) => e.preventDefault()}
              >
                <Bookmark className="h-4 w-4" />
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-ink-800 shadow-lg backdrop-blur-sm transition-colors hover:bg-gold-500 hover:text-white dark:bg-ink-900/90 dark:text-sand-100"
                aria-label="مشاركة"
                onClick={(e) => e.preventDefault()}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="badge badge-gold !px-2.5 !py-0.5 text-[11px]">{cat.name}</span>
            {loc && (
              <span className="flex items-center gap-0.5 text-[11px] text-[var(--muted)]">
                <MapPin className="h-3 w-3" />
                {loc.name}
              </span>
            )}
          </div>

          <h3 className="mb-2.5 font-kufi text-lg font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors duration-300 group-hover:text-gold-600">
            {t.title}
          </h3>

          <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
            {truncate(t.excerpt, 130)}
          </p>

          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-lapis-600 to-lapis-900 font-kufi text-[10px] font-bold text-gold-400">
                {authorName.charAt(0)}
              </span>
              <span className="text-[11px] font-medium text-[var(--muted)]">{authorName}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[var(--muted)]">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(article.publishedAt, locale)}</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}


