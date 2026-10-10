'use client'

import Link from 'next/link'
import { Play, Mic, Clock, Headphones, Radio, ArrowLeft, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

const UI: Record<Locale, any> = {
  ar: {
    badge: 'بودكاست العراق الآن',
    title: 'اسمع العراق',
    subtitle: 'حوارات وتحليلات صوتية أسبوعية — من قلب الأحداث',
    listen: 'استمع الآن',
    all: 'كل الحلقات',
    new: 'حلقة جديدة',
    episodes: 'حلقة',
    latest: 'أحدث الحلقات',
  },
  ku: {
    badge: 'پۆدکاستی عێراق ئێستا',
    title: 'عێراق ببیستە',
    subtitle: 'گفتوگۆ و شیکاری دەنگی هەفتانە — لە دڵی ڕووداوەکانەوە',
    listen: 'ئێستا گوێبگرە',
    all: 'هەموو ئەڵقەکان',
    new: 'ئەڵقەی نوێ',
    episodes: 'ئەڵقە',
    latest: 'دوایین ئەڵقەکان',
  },
  en: {
    badge: 'Iraq Now Podcast',
    title: 'Listen to Iraq',
    subtitle: 'Weekly audio conversations and analysis — from the heart of events',
    listen: 'Listen Now',
    all: 'All Episodes',
    new: 'New Episode',
    episodes: 'episodes',
    latest: 'Latest Episodes',
  },
}

const EPISODES = [
  {
    id: '1',
    number: 42,
    duration: '38:24',
    title: {
      ar: 'مستقبل الاقتصاد العراقي بعد النفط',
      ku: 'داهاتووی ئابووری عێراق دوای نەوت',
      en: 'Iraq\'s Post-Oil Economic Future',
    },
    guest: { ar: 'د. مظهر محمد صالح', ku: 'د. مظەهر محەمەد سالح', en: 'Dr. Mazhar Mohammed' },
    color: 'from-lapis-600 to-lapis-900',
    cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80',
    isNew: true,
  },
  {
    id: '2',
    number: 41,
    duration: '45:10',
    title: {
      ar: 'الموصل: عشر سنوات من إعادة الإعمار',
      ku: 'موسڵ: دە ساڵ لە نۆژەنکردنەوە',
      en: 'Mosul: Ten Years of Reconstruction',
    },
    guest: { ar: 'م. أحمد العبيدي', ku: 'ئەحمەد عوبەیدی', en: 'Eng. Ahmed Al-Obaidi' },
    color: 'from-terra-500 to-terra-800',
    cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80',
    isNew: false,
  },
  {
    id: '3',
    number: 40,
    duration: '32:55',
    title: {
      ar: 'المياه في بلاد الرافدين: أزمة الحاضر وخطر المستقبل',
      ku: 'ئاو لە میزۆپۆتامیا: قەیرانی ئێستا',
      en: 'Water in Mesopotamia: The Coming Crisis',
    },
    guest: { ar: 'د. سهام الربيعي', ku: 'د. سهام ڕوبەیعی', en: 'Dr. Siham Al-Rubaie' },
    color: 'from-emerald-600 to-emerald-900',
    cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80',
    isNew: false,
  },
]

export function PodcastSection({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

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
                    {EPISODES[0].duration}
                  </span>
                </div>

                <div className="relative mb-5 aspect-square overflow-hidden rounded-2xl">
                  <img
                    src={EPISODES[0].cover}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-lapis-950/80 to-transparent" />
                  <button
                    className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-lapis-950 shadow-2xl shadow-gold-500/40 transition-all duration-300 hover:scale-110 hover:bg-gold-400"
                    aria-label={t.listen}
                  >
                    <Play className="h-7 w-7 translate-x-0.5 rtl:-translate-x-0.5" fill="currentColor" />
                  </button>
                  <div className="absolute bottom-3 start-3 end-3 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-1/3 rounded-full bg-gold-500" />
                    </div>
                    <span className="text-[10px] font-medium text-white/80">13:08</span>
                  </div>
                </div>

                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gold-400">
                  {locale === 'en' ? 'Episode' : locale === 'ku' ? 'ئەڵقە' : 'الحلقة'} {EPISODES[0].number}
                </p>
                <h3 className="mb-2 font-kufi text-lg font-bold leading-snug">
                  {EPISODES[0].title[locale]}
                </h3>
                <p className="text-xs text-sand-100/60">{EPISODES[0].guest[locale]}</p>

                <button className="btn-primary mt-5 w-full !rounded-xl font-kufi">
                  <Headphones className="h-4 w-4" />
                  {t.listen}
                </button>
              </div>
            </div>
          </Reveal>

          {/* قائمة الحلقات */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {EPISODES.slice(1).map((ep, i) => (
              <Reveal key={ep.id} delay={i * 100}>
                <article className="group flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-all duration-400 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-xl">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                    <img src={ep.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${ep.color} opacity-30`} />
                    <button
                      className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lapis-950 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-110"
                      aria-label={t.listen}
                    >
                      <Play className="h-4 w-4 translate-x-0.5 rtl:-translate-x-0.5" fill="currentColor" />
                    </button>
                    <span className="absolute bottom-1.5 end-1.5 rounded-md bg-lapis-950/80 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                      {ep.duration}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-600">
                      {locale === 'en' ? 'Episode' : locale === 'ku' ? 'ئەڵقە' : 'الحلقة'} {ep.number}
                    </p>
                    <h3 className="mb-1.5 font-kufi text-base font-bold leading-snug text-[var(--foreground)] line-clamp-2 transition-colors group-hover:text-gold-600">
                      {ep.title[locale]}
                    </h3>
                    <p className="mb-2 text-xs text-[var(--muted)]">{ep.guest[locale]}</p>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-gold-600 transition-colors hover:text-gold-500">
                        <Play className="h-3.5 w-3.5" />
                        {t.listen}
                      </button>
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
                    <p className="font-kufi text-xl font-bold text-[var(--foreground)]">42+</p>
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
      </div>
    </section>
  )
}
