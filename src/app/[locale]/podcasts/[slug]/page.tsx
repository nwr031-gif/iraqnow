import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Calendar, Headphones, Share2, ArrowLeft, ArrowRight, Home, ChevronLeft, ListMusic } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { PodcastPlayer } from '@/components/podcast/PodcastPlayer'
import { getPodcastBySlug, getPodcasts } from '@/lib/data'
import type { Locale } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

const UI: Record<Locale, any> = {
  ar: {
    home: 'الرئيسية', podcasts: 'البودكاست', episode: 'الحلقة', season: 'الموسم', guest: 'الضيف',
    showNotes: 'ملاحظات الحلقة', related: 'حلقات ذات صلة', listen: 'استمع', share: 'شارك الحلقة',
    copyLink: 'نسخ الرابط', copied: 'تم النسخ!', views: 'استماع', notFound: 'الحلقة غير موجودة',
  },
  ku: {
    home: 'سەرەکی', podcasts: 'پۆدکاست', episode: 'ئەڵقە', season: 'وەرز', guest: 'میوان',
    showNotes: 'تێبینییەکانی ئەڵقە', related: 'ئەڵقە پەیوەندیدارەکان', listen: 'گوێبگرە', share: 'هاوبەشکردن',
    copyLink: 'کۆپیکردنی لینک', copied: 'کۆپی کرا!', views: 'گوێگرتن', notFound: 'ئەڵقە نەدۆزرایەوە',
  },
  en: {
    home: 'Home', podcasts: 'Podcasts', episode: 'Episode', season: 'Season', guest: 'Guest',
    showNotes: 'Show Notes', related: 'Related Episodes', listen: 'Listen', share: 'Share Episode',
    copyLink: 'Copy Link', copied: 'Copied!', views: 'plays', notFound: 'Episode not found',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const episode = await getPodcastBySlug(slug)
  if (!episode) return { title: 'الحلقة غير موجودة' }
  const tr = episode.translations.find((t) => t.locale === locale) || episode.translations[0]
  return {
    title: `${tr?.title} — بودكاست العراق الآن`,
    description: tr?.description || '',
    alternates: { languages: { ar: `/ar/podcasts/${slug}`, ku: `/ku/podcasts/${slug}`, en: `/en/podcasts/${slug}` } },
  }
}

export default async function PodcastEpisodePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as Locale
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const episode = await getPodcastBySlug(slug)
  if (!episode) notFound()

  const allEpisodes = await getPodcasts()
  const related = allEpisodes.filter((e) => e.slug !== slug).slice(0, 3)

  const tr = episode.translations.find((x) => x.locale === locale) || episode.translations[0]
  const title = tr?.title || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: title,
    description: tr?.description,
    episodeNumber: episode.episodeNumber,
    partOfSeason: episode.season,
    duration: episode.duration,
    datePublished: episode.publishedAt,
    associatedMedia: { '@type': 'MediaObject', contentUrl: episode.audioUrl },
    inLanguage: locale === 'ku' ? 'ckb' : locale,
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* الرأس */}
      <section className="relative overflow-hidden bg-lapis-950 py-12 text-white lg:py-16">
        <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-30" aria-hidden="true" />

        <div className="container-main relative">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-sand-100/50">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-400">
              <Home className="h-3.5 w-3.5" />
              {t.home}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <Link href={`/${locale}/podcasts`} className="transition-colors hover:text-gold-400">
              {t.podcasts}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="truncate font-medium text-gold-400">
              {t.episode} {episode.episodeNumber}
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            <Reveal className="lg:col-span-1">
              <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-gold-500/25 shadow-2xl shadow-lapis-950/50 lg:max-w-none">
                <img
                  src={episode.coverUrl || `https://picsum.photos/seed/${episode.slug}/800/800`}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lapis-950/60 via-transparent to-transparent" />
                <div className="absolute start-4 top-4 flex gap-2">
                  <span className="rounded-xl bg-gold-500 px-3 py-1 font-kufi text-xs font-bold text-lapis-950">
                    {t.episode} {episode.episodeNumber}
                  </span>
                  <span className="rounded-xl bg-lapis-950/80 px-3 py-1 text-xs font-medium text-sand-100/80 backdrop-blur-sm">
                    {t.season} {episode.season}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} className="flex flex-col justify-center lg:col-span-2">
              <h1 className="font-kufi text-2xl font-bold leading-snug lg:text-4xl">{title}</h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sand-100/65">{tr?.description}</p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-sand-100/50">
                {episode.guest[locale] && (
                  <span className="flex items-center gap-1.5">
                    <Headphones className="h-3.5 w-3.5 text-gold-500" />
                    {t.guest}: {episode.guest[locale]}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold-500" />
                  {episode.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gold-500" />
                  {new Date(episode.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Headphones className="h-3.5 w-3.5 text-gold-500" />
                  {episode.views.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.views}
                </span>
              </div>

              <PodcastPlayer audioUrl={episode.audioUrl} title={title} locale={locale} />

              <div className="mt-4 flex items-center gap-3">
                <button
                  className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-medium text-sand-100/70 transition-colors hover:border-gold-500/50 hover:text-gold-400"
                  title={t.share}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {t.share}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-main py-12">
        {/* Show Notes */}
        {tr?.showNotes && (
          <Reveal>
            <section className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 lg:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-kufi text-lg font-bold text-[var(--foreground)]">
                <ListMusic className="h-5 w-5 text-gold-500" />
                {t.showNotes}
              </h2>
              <div className="whitespace-pre-line text-sm leading-loose text-[var(--muted)]">
                {tr.showNotes}
              </div>
            </section>
          </Reveal>
        )}

        <CuneiformDivider variant="star" className="my-12 opacity-40" />

        {/* حلقات ذات صلة */}
        {related.length > 0 && (
          <section>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="section-title font-kufi text-xl font-bold lg:text-2xl">{t.related}</h2>
              <Link href={`/${locale}/podcasts`} className="flex items-center gap-1.5 text-xs font-medium text-gold-600 hover:text-gold-500">
                {t.podcasts}
                <Arrow className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((ep, i) => {
                const epTitle = ep.translations.find((x) => x.locale === locale)?.title || ep.translations[0]?.title
                return (
                  <Reveal key={ep.id} delay={i * 80}>
                    <Link
                      href={`/${locale}/podcasts/${ep.slug}`}
                      className="group flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-xl"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                        <img src={ep.coverUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="text-[10px] font-bold text-gold-600">
                          {t.episode} {ep.episodeNumber}
                        </p>
                        <h3 className="mt-1 font-kufi text-sm font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:text-gold-600">
                          {epTitle}
                        </h3>
                        <p className="mt-1.5 text-[10px] text-[var(--muted)]">{ep.duration}</p>
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
