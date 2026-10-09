'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Eye, Bookmark, Share2, Flame } from 'lucide-react'
import { cn, formatRelativeTime, truncate } from '@/lib/utils'

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
  category: { slug: string; translations: Array<{ locale: 'ar' | 'ku' | 'en'; name: string }> }
  author: { name: string; avatar?: string }
  location?: { governorate?: { translations: Array<{ locale: 'ar' | 'ku' | 'en'; name: string }> } }
}

interface ArticleCardProps {
  article: ArticleData
  locale: 'ar' | 'ku' | 'en'
  variant?: 'default' | 'compact' | 'featured'
}

export function ArticleCard({ article, locale, variant = 'default' }: ArticleCardProps) {
  const t = article.translations.find(tr => tr.locale === locale) || article.translations[0]
  const cat = article.category.translations.find(tr => tr.locale === locale) || article.category.translations[0]
  const loc = article.location?.governorate?.translations.find(tr => tr.locale === locale) || article.location?.governorate?.translations[0]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const hasImage = article.media.length > 0

  if (variant === 'compact') {
    return (
      <Link
        href={`/${locale}/article/${article.slug}`}
        className="group flex gap-3 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:hover:shadow-accent/10"
        style={{ direction: dir }}
      >
        {hasImage && (
          <Image
            src={article.media[0].media.url}
            alt={article.media[0].media.alt}
            width={100}
            height={70}
            className="h-18 w-28 shrink-0 rounded-lg object-cover"
            sizes="70px"
          />
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1">
              {article.breaking && <span className="text-[10px] font-bold text-error">{locale === 'ar' ? 'عاجل' : locale === 'ku' ? 'بەھێز' : 'LIVE'}</span>}
              <span className="text-[11px] font-medium text-accent">{cat.name}</span>
            </div>
            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-accent transition-colors dark:text-white">
              {t.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">{formatRelativeTime(article.publishedAt, locale)}</span>
            {loc && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{loc.name}</span>}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <article className="relative group">
        <Link href={`/${locale}/article/${article.slug}`} className="block relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
          {hasImage && (
            <Image
              src={article.media[0].media.url}
              alt={article.media[0].media.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {article.breaking && (
                <span className="flex items-center gap-1 rounded-full bg-error px-3 py-1 text-xs font-bold text-white animate-pulse">
                  <Flame className="h-3 w-3" />
                  {locale === 'ar' ? 'عاجل' : locale === 'ku' ? 'بەھێز' : 'BREAKING'}
                </span>
              )}
              <Link href={`/${locale}/category/${article.category.slug}`} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/30">
                {cat.name}
              </Link>
            </div>
            <h2 className="mb-2 text-xl font-bold text-white leading-tight line-clamp-2">{t.title}</h2>
            <p className="mb-4 text-sm text-white/90 line-clamp-2 max-w-md">{t.excerpt}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(article.publishedAt, locale)}</span>
              {article.readingTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readingTime} {locale === 'ar' ? 'دقيقة' : locale === 'ku' ? 'چرکە' : 'min'}</span>}
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}</span>
              {loc && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{loc.name}</span>}
            </div>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="card-hover overflow-hidden" style={{ direction: dir }}>
      <Link href={`/${locale}/article/${article.slug}`} className="block">
        {hasImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={article.media[0].media.url}
              alt={article.media[0].media.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 left-2 flex gap-2" style={{ [dir === 'rtl' ? 'left' : 'right']: 8 }}>
              {article.breaking && (
                <span className="flex items-center gap-1 rounded-full bg-error px-2 py-1 text-[10px] font-bold text-white animate-pulse">
                  <Flame className="h-3 w-3" />
                  {locale === 'ar' ? 'عاجل' : locale === 'ku' ? 'بەھێز' : 'LIVE'}
                </span>
              )}
              <Link
                href={`/${locale}/category/${article.category.slug}`}
                className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-700 backdrop-blur-sm hover:bg-white dark:bg-gray-900/90 dark:text-gray-300"
                onClick={(e) => e.stopPropagation()}
              >
                {cat.name}
              </Link>
            </div>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/${locale}/category/${article.category.slug}`}
              className="text-xs font-medium text-accent hover:underline"
            >
              {cat.name}
            </Link>
            {loc && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3" />
                {loc.name}
              </span>
            )}
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-accent transition-colors dark:text-white">
            {t.title}
          </h3>
          <p className="mb-3 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
            {truncate(t.excerpt, 120)}
          </p>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(article.publishedAt, locale)}
              </span>
              {article.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readingTime} {locale === 'ar' ? 'دقيقة' : locale === 'ku' ? 'چرکە' : 'min'}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.viewCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Bookmark">
                <Bookmark className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Share">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
       </Link>
    </article>
  )
}