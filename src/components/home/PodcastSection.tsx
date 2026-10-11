'use client'

import Link from 'next/link'
import { Play, Mic, Clock, Headphones, Radio, ArrowLeft, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

export interface PodcastEpisodeData {
  id: string
  slug: string
  episodeNumber: number
  duration: string
  coverUrl: string
  guest: Record<Locale, string>
  translations: { locale: Locale; title: string }[]
}

const UI: Record<Locale, any> = {
  ar: {
    badge: 'بودكاست العراق الآن',
    title: 'اسمع العراق',
    subtitle: 'حوارات وتحليلات صوتية أسبوعية — من قلب الأحداث',
    listen: 'استمع الآن',
    all: 'كل الحلقات',
    new: 'حلقة جديدة',
    episodes: 'حلقة',
    episode: 'الحلقة',
    soon: 'البودكاست قريباً',
    soonDesc: 'نحضّر لكم حوارات صوتية حصرية من قلب العراق. ترقبوا أولى الحلقات!',
  },
  ku: {
    badge: 'پۆدکاستی عێراق ئێستا',
    title: 'عێراق ببیستە',
    subtitle: 'گفتوگۆ و شیکاری دەنگی هەفتانە — لە دڵی ڕووداوەکانەوە',
    listen: 'ئێستا گوێبگرە',
    all: 'هەموو ئەڵقەکان',
    new: 'ئەڵقەی نوێ',
    episodes: 'ئەڵقە',
    episode: 'ئەڵقە',
    soon: 'پۆدکاست بەم زووانە',
    soonDesc: 'گفتوگۆ دەنگی تایبەت لە دڵی عێراقەوە ئامادە دەکەین. چاوەڕوانی یەکەم ئەڵقە بن!',
  },
  en: {
    badge: 'Iraq Now Podcast',
    title: 'Listen to Iraq',
    subtitle: 'Weekly audio conversations and analysis — from the heart of events',
    listen: 'Listen Now',
    all: 'All Episodes',
    new: 'New Episode',
    episodes: 'episodes',
    episode: 'Episode',
    soon: 'Podcast Coming Soon',
    soonDesc: 'We\'re preparing exclusive audio conversations from the heart of Iraq. Stay tuned!',
  },
}

function titleOf(ep: PodcastEpisodeData, locale: Locale) {
  return ep.translations.find((tr) => tr.locale === locale)?.title
    || ep.translations.find((tr) => tr.locale === 'ar')?.title
    || ep.translations[0]?.title
    || ''
}

export function PodcastSection({ locale, episodes = [] }: { locale: Locale; episodes?: PodcastEpisodeData[] }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const featured = episodes[0]
  const rest = episodes.slice(1)

  return (
    <section className="relative overflow-hidden bg-[var(--background)] py-14 lg:py-20" dir={dir} aria-labelledby="podcast-heading">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" aria-hidden="true" />

      <div className="container-main">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="badge badge-lapis mb-3">
                <Mic className="h-3.5 w-3.5" />
                {t.badge}
              </span>
              <h2 id="podcast-heading" className="section-title font-kufi text-3xl font-bold lg:text-4xl">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{t.subtitle}</p>
            </div>
            <Link
              href={`/${locale}/podcasts`}
              className="group flex items-center gap-2 rounded-xl border border-gold-500/40 px-5 py-2.5 text-sm font-semibold text-gold-600 transition-all duration-300 hover:bg-gold-500 hover:text-lapis-950"
            >
              {t.all}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {!featured ? (
          <Reveal>
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gold-500/30 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lapis-800 text-gold-400">
                <Headphones className="h-8 w-8" />
              </span>
              <p className="font-kufi text-lg font-bold text-[var(--foreground)]">{t.soon}</p>
              <p className="max-w-sm text-sm text-[var(--muted)]">{t.soonDesc}</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* البطاقة الرئيسية */}
            <Reveal className="lg:col-span-1">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-br from-lapis-800 to-lapis-950 p-6 text-white">
                <div className="pointer-events-none absolute -end-10 -top-10 opacity-10">
                  <IshtarStar size={200} />
                </div>

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="badge badge-live text-[10px] font-bold">
                      <Radio className="h-3 w-3 animate-pulse" />
                      {t.new}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-sand-100/60">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.duration}
                    </span>
                  </div>

                  <div className="relative mb-5 aspect-square overflow-hidden rounded-2xl bg-lapis-900">
                    {featured.coverUrl && (
                      <img
                        src={featured.coverUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-lapis-950/80 to-transparent" />
                    <a
                      href={`/${locale}/podcasts/${featured.slug}`}
                      className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-lapis-950 shadow-2xl shadow-gold-500/40 transition-all duration-300 hover:scale-110 hover:bg-gold-400"
                      aria-label={t.listen}
                    >
                      <Play className="h-7 w-7 translate-x-0.5 rtl:-translate-x-0.5" fill="currentColor" />
                    </a>
                  </div>

                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gold-400">
                    {t.episode} {featured.episodeNumber}
                  </p>
                  <h3 className="mb-2 font-kufi text-lg font-bold leading-snug">
                    {titleOf(featured, locale)}
                  </h3>
                  {featured.guest?.[locale] && (
                    <p className="text-xs text-sand-100/60">{featured.guest[locale]}</p>
                  )}

                  <Link href={`/${locale}/podcasts/${featured.slug}`} className="btn-primary mt-5 w-full !rounded-xl font-kufi">
                    <Headphones className="h-4 w-4" />
                    {t.listen}
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* قائمة الحلقات */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {rest.map((ep, i) => (
                <Reveal key={ep.id} delay={i * 100}>
                  <article className="group flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-all duration-400 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-xl">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-lapis-900 sm:h-28 sm:w-28">
                      {ep.coverUrl && (
                        <img src={ep.coverUrl} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      )}
                      <Link
                        href={`/${locale}/podcasts/${ep.slug}`}
                        className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lapis-950 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-110"
                        aria-label={t.listen}
                      >
                        <Play className="h-4 w-4 translate-x-0.5 rtl:-translate-x-0.5" fill="currentColor" />
                      </Link>
                      <span className="absolute bottom-1.5 end-1.5 rounded-md bg-lapis-950/80 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                        {ep.duration}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-600">
                        {t.episode} {ep.episodeNumber}
                      </p>
                      <h3 className="mb-1.5 font-kufi text-base font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:text-gold-600">
                        {titleOf(ep, locale)}
                      </h3>
                      {ep.guest?.[locale] && (
                        <p className="mb-2 text-xs text-[var(--muted)]">{ep.guest[locale]}</p>
                      )}
                      <div className="flex items-center gap-3">
                        <Link href={`/${locale}/podcasts/${ep.slug}`} className="flex items-center gap-1.5 text-xs font-semibold text-gold-600 transition-colors hover:text-gold-500">
                          <Play className="h-3.5 w-3.5" />
                          {t.listen}
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}

              {/* بطاقة إحصائية */}
              <Reveal delay={200}>
                <div className="flex items-center justify-between rounded-2xl border border-gold-500/20 bg-gradient-to-l from-gold-500/10 to-transparent p-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-600">
                      <Headphones className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-kufi text-xl font-bold text-[var(--foreground)]">{episodes.length}</p>
                      <p className="text-xs text-[var(--muted)]">{t.episodes}</p>
                    </div>
                  </div>
                  <Link href={`/${locale}/podcasts`} className="btn-outline !px-4 !py-2 text-xs">
                    {t.all}
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
