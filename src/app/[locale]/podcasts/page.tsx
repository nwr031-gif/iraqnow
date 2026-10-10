import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Mic, Play, Clock, Calendar, ArrowLeft, ArrowRight, Headphones, Radio } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { PodcastPlayer } from '@/components/podcast/PodcastPlayer'
import { getPodcasts } from '@/lib/data'
import type { Locale } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'بودكاست العراق الآن',
  description: 'حوارات وتحليلات صوتية أسبوعية من قلب العراق — اقتصاт، سياسة، ثقافة ومجتمع',
  alternates: { languages: { ar: '/ar/podcasts', ku: '/ku/podcasts', en: '/en/podcasts' } },
}

const UI: Record<Locale, any> = {
  ar: {
    badge: 'بودكاست العراق الآن',
    title: 'اسمع العراق',
    subtitle: 'حوارات وتحليلات صوتية أسبوعية — من قلب الأحداث، بثلاث لغات',
    latest: 'أحدث حلقة',
    all: 'جميع الحلقات',
    seasons: 'المواسم',
    season: 'الموسم',
    episode: 'الحلقة',
    listen: 'استمع الآن',
    listenOn: 'استمع على',
    guest: 'الضيف',
    duration: 'المدة',
    date: 'التاريخ',
    views: 'استماع',
    details: 'تفاصيل الحلقة',
    subscribe: 'اشترك في البودكاست',
    rss: 'RSS',
    noEpisodes: 'لا توجد حلقات منشورة بعد',
  },
  ku: {
    badge: 'پۆدکاستی عێراق ئێستا',
    title: 'عێراق ببیستە',
    subtitle: 'گفتوگۆ و شیکاری دەنگی هەفتانە',
    latest: 'نوێترین ئەڵقە',
    all: 'هەموو ئەڵقەکان',
    seasons: 'وەرزەکان',
    season: 'وەرز',
    episode: 'ئەڵقە',
    listen: 'ئێستا گوێبگرە',
    listenOn: 'گوێبگرە لەسەر',
    guest: 'میوان',
    duration: 'ماوە',
    date: 'بەروار',
    views: 'گوێگرتن',
    details: 'وردەکاری ئەڵقە',
    subscribe: 'بەشداربە',
    rss: 'RSS',
    noEpisodes: 'هیچ ئەڵقەیەک نییە',
  },
  en: {
    badge: 'Iraq Now Podcast',
    title: 'Listen to Iraq',
    subtitle: 'Weekly audio conversations and analysis — from the heart of events, in three languages',
    latest: 'Latest Episode',
    all: 'All Episodes',
    seasons: 'Seasons',
    season: 'Season',
    episode: 'Episode',
    listen: 'Listen Now',
    listenOn: 'Listen on',
    guest: 'Guest',
    duration: 'Duration',
    date: 'Date',
    views: 'Plays',
    details: 'Episode Details',
    subscribe: 'Subscribe',
    rss: 'RSS',
    noEpisodes: 'No episodes published yet',
  },
}

const SUBSCRIBE_LINKS = [
  { label: 'Apple Podcasts', href: 'https://podcasts.apple.com', icon: '🍎' },
  { label: 'Spotify', href: 'https://open.spotify.com', icon: '🟢' },
  { label: 'Google Podcasts', href: 'https://podcasts.google.com', icon: '🎧' },
  { label: 'RSS', href: '/rss', icon: '📡' },
]

export default async function PodcastsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as Locale
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const episodes = await getPodcasts()
  const featured = episodes[0]
  const rest = episodes.slice(1)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: locale === 'en' ? 'Iraq Now Podcast' : 'بودكاست العراق الآن',
    description: t.subtitle,
    inLanguage: locale === 'ku' ? 'ckb' : locale,
    webFeed: 'https://iraqnow.iq/rss',
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* الرأس */}
      <section className="relative overflow-hidden bg-lapis-950 py-16 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-24 end-1/4 h-96 w-96 rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="container-main relative text-center">
          <Reveal>
            <span className="badge border border-gold-500/30 bg-gold-500/10 text-gold-400 mx-auto mb-5">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              {t.badge}
            </span>
            <h1 className="font-kufi text-4xl font-bold lg:text-6xl">
              <span className="text-gold-gradient">{t.title}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sand-100/60 lg:text-base">
              {t.subtitle}
            </p>

            {/* أزرار الاشتراك */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {SUBSCRIBE_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-medium text-sand-100/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/50 hover:text-gold-400"
                >
                  <span aria-hidden="true">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {episodes.length === 0 ? (
        <div className="container-main flex flex-col items-center gap-4 py-24 text-center">
          <Mic className="h-14 w-14 text-[var(--muted)] opacity-30" />
          <p className="text-sm text-[var(--muted)]">{t.noEpisodes}</p>
        </div>
      ) : (
        <div className="container-main py-12 lg:py-16">
          {/* الحلقة المميزة */}
          {featured && (
            <Reveal>
              <section aria-labelledby="featured-episode">
                <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
                  </span>
                  {t.latest}
                </p>

                <div className="grid gap-8 lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <div className="relative overflow-hidden rounded-3xl border border-gold-500/25 shadow-2xl shadow-lapis-950/20">
                      <img
                        src={featured.coverUrl || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80&sig=${featured.slug}/800/800`}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-lapis-950/70 via-transparent to-transparent" />
                      <span className="absolute start-4 top-4 rounded-xl bg-gold-500 px-3.5 py-1.5 font-kufi text-xs font-bold text-lapis-950">
                        {t.episode} {featured.episodeNumber} — {t.season} {featured.season}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center lg:col-span-3">
                    <h2 id="featured-episode" className="font-kufi text-2xl font-bold leading-snug text-[var(--foreground)] lg:text-3xl">
                      {featured.translations.find((tr) => tr.locale === locale)?.title || featured.translations[0]?.title}
                    </h2>

                    <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                      {featured.translations.find((tr) => tr.locale === locale)?.description || featured.translations[0]?.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
                      {featured.guest[locale] && (
                        <span className="flex items-center gap-1.5">
                          <Headphones className="h-3.5 w-3.5 text-gold-500" />
                          {featured.guest[locale]}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gold-500" />
                        {featured.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gold-500" />
                        {new Date(featured.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    {/* المشغل */}
                    <PodcastPlayer
                      audioUrl={featured.audioUrl}
                      title={featured.translations.find((tr) => tr.locale === locale)?.title || ''}
                      locale={locale}
                    />

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/${locale}/podcasts/${featured.slug}`}
                        className="btn-outline !py-2.5 text-xs font-kufi"
                      >
                        {t.details}
                        {dir === 'rtl' ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>
          )}

          <CuneiformDivider variant="star" className="my-12 opacity-50" />

          {/* كل الحلقات */}
          <section aria-labelledby="all-episodes">
            <div className="mb-8 flex items-center justify-between">
              <h2 id="all-episodes" className="section-title font-kufi text-2xl font-bold lg:text-3xl">
                {t.all}
              </h2>
              <span className="badge badge-gold">
                {episodes.length.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.episode}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((ep, i) => {
                const title = ep.translations.find((tr) => tr.locale === locale)?.title || ep.translations[0]?.title
                return (
                  <Reveal key={ep.id} delay={(i % 3) * 80}>
                    <Link
                      href={`/${locale}/podcasts/${ep.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] transition-all duration-400 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-2xl hover:shadow-lapis-900/15"
                    >
                      <div className="img-zoom relative aspect-video overflow-hidden">
                        <img
                          src={ep.coverUrl || `https://picsum.photos/seed/${ep.slug}/600/340`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-lapis-950/80 via-transparent to-transparent" />
                        <span className="absolute start-3 top-3 rounded-lg bg-lapis-950/80 px-2.5 py-1 text-[10px] font-bold text-gold-400 backdrop-blur-sm">
                          {t.episode} {ep.episodeNumber}
                        </span>
                        <div className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-lapis-950 opacity-0 shadow-2xl transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
                          <Play className="h-6 w-6 translate-x-0.5 rtl:-translate-x-0.5" fill="currentColor" />
                        </div>
                        <span className="absolute bottom-2.5 end-3 rounded-md bg-lapis-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                          {ep.duration}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-kufi text-sm font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:text-gold-600">
                          {title}
                        </h3>
                        <p className="mt-2 text-[11px] text-[var(--muted)] line-clamp-1">{ep.guest[locale]}</p>
                        <div className="mt-auto flex items-center gap-3 pt-3 text-[10px] text-[var(--muted)]">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(ep.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Headphones className="h-3 w-3" />
                            {ep.views.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
