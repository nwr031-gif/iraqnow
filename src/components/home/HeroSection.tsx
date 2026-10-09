'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Flame, Play, ArrowLeft, ArrowRight, Sparkles, Radio } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { IshtarStar } from '@/components/brand/Brand'
import { Reveal } from '@/components/ui/Reveal'

type Locale = 'ar' | 'ku' | 'en'

interface HeroArticle {
  id: string
  slug: string
  image: string
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  category: Record<Locale, string>
  categorySlug: string
  location: Record<Locale, string>
  author: string
  timeAgo: number
  views: number
  hot?: boolean
}

const FEATURED: HeroArticle = {
  id: '1',
  slug: 'iraq-economic-reform-2026',
  image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1600&h=900&fit=crop&q=80',
  title: {
    ar: 'العراق يعلن حزمة إصلاحات اقتصادية تاريخية لتنويع مصادر الدخل',
    ku: 'عێراق پاکێجی چاکسازی ئابووری مێژوویی ڕادەگەیەنێت',
    en: 'Iraq Announces Historic Economic Reform Package to Diversify Income',
  },
  excerpt: {
    ar: 'خطة خمسية شاملة تستهدف خلق نصف مليون فرصة عمل، وتقليل الاعتماد على النفط إلى 60% بحلول 2030، مع إطلاق صندوق سيادي للتنمية.',
    ku: 'پلانێکی پێنج ساڵەی گشتگیر بۆ دروستکردنی ٥٠٠ هەزار دەرفەتی کار',
    en: 'A comprehensive five-year plan targeting half a million jobs and reducing oil dependence to 60% by 2030.',
  },
  category: { ar: 'الاقتصاد', ku: 'ئابووری', en: 'Economy' },
  categorySlug: 'economy',
  location: { ar: 'بغداد', ku: 'بەغداد', en: 'Baghdad' },
  author: 'أحمد الزبيدي',
  timeAgo: 2,
  views: 48500,
  hot: true,
}

const SIDE_ARTICLES: HeroArticle[] = [
  {
    id: '2', slug: 'kurdistan-investment',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f3561d7?w=800&h=600&fit=crop&q=80',
    title: { ar: 'إقليم كردستان يقر قانون استثمار جديداً بجذب 3 مليارات دولار', ku: 'یاسای سەرمایەکاری نوێ لە هەرێمی کوردستان', en: 'Kurdistan Region Passes New Investment Law' },
    excerpt: { ar: '', ku: '', en: '' },
    category: { ar: 'اقتصاد', ku: 'ئابووری', en: 'Economy' },
    categorySlug: 'economy',
    location: { ar: 'أربيل', ku: 'هەولێر', en: 'Erbil' },
    author: 'سوران محمد', timeAgo: 4, views: 15200,
  },
  {
    id: '3', slug: 'baghdad-metro',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&q=80',
    title: { ar: 'انطلاق المرحلة الأولى من مترو بغداد بطول 30 كم', ku: 'دەستپێکردنی قۆناغی یەکەمی مێترۆی بەغداد', en: 'First Phase of Baghdad Metro Launches' },
    excerpt: { ar: '', ku: '', en: '' },
    category: { ar: 'محليات', ku: 'ناوخۆ', en: 'Local' },
    categorySlug: 'local',
    location: { ar: 'بغداد', ku: 'بەغداد', en: 'Baghdad' },
    author: 'ليلى حسن', timeAgo: 1, views: 22100, hot: true,
  },
  {
    id: '4', slug: 'basra-port',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&q=80',
    title: { ar: 'ميناء الفاو الكبير يستقبل أول سفينة تجارية ضخمة', ku: 'بەندەری فاو گەورە یەکەم کەشتیی بازرگانی وەردەگرێت', en: 'Grand Faw Port Receives First Commercial Ship' },
    excerpt: { ar: '', ku: '', en: '' },
    category: { ar: 'اقتصاد', ku: 'ئابووری', en: 'Economy' },
    categorySlug: 'economy',
    location: { ar: 'البصرة', ku: 'بەسرە', en: 'Basra' },
    author: 'حسين العلي', timeAgo: 6, views: 9800,
  },
  {
    id: '5', slug: 'climate-summit',
    image: 'https://images.unsplash.com/photo-1569163139544-8d8d71f9b594?w=800&h=600&fit=crop&q=80',
    title: { ar: 'العراق يستضيف قمة مناخية إقليمية لمواجهة الجفاف', ku: 'عێراق میوانداری لووتکەی کەشوهەوای ناوچەیی دەکات', en: 'Iraq Hosts Regional Climate Summit' },
    excerpt: { ar: '', ku: '', en: '' },
    category: { ar: 'البيئة', ku: 'ژینگە', en: 'Environment' },
    categorySlug: 'environment',
    location: { ar: 'البصرة', ku: 'بەسرە', en: 'Basra' },
    author: 'عمر عبد الله', timeAgo: 8, views: 7600,
  },
]

const UI: Record<Locale, any> = {
  ar: { featured: 'الخبر الأهم', watch: 'شاهد الآن', browse: 'تصفح الأقسام', tagline: 'صوت العراق الحقيقي', subtitle: 'تغطية شاملة ومستقلة من بغداد إلى أربيل والبصرة والموصل — بثلاث لغات', readMore: 'اقرأ المزيد', live: 'تغطية مباشرة', latest: 'آخر التحديثات' },
  ku: { featured: 'گرنگترین هەواڵ', watch: 'ئێستا ببینە', browse: 'بەشەکان ببینە', tagline: 'دەنگی ڕاستەقینەی عێراق', subtitle: 'پەرپێدانی گشتگیر و سەربەخۆ لە بەغدادەوە بۆ هەولێر و بەسرە و موسڵ', readMore: 'زیاتر بخوێنە', live: 'پەخشی ڕاستەوخۆ', latest: 'دوایین نوێکردنەوەکان' },
  en: { featured: 'Breaking Story', watch: 'Watch Now', browse: 'Browse Sections', tagline: 'The True Voice of Iraq', subtitle: 'Comprehensive, independent coverage from Baghdad to Erbil, Basra and Mosul — in three languages', readMore: 'Read More', live: 'Live Coverage', latest: 'Latest Updates' },
}

export function HeroSection({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const title = FEATURED.title[locale]
  const cat = FEATURED.category[locale]
  const loc = FEATURED.location[locale]

  return (
    <section className="relative overflow-hidden bg-lapis-950 text-white" dir={dir} id="top">
      {/* الخلفية المعمارية */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
                <g fill='none' stroke='%23d4af37' stroke-opacity='0.10' stroke-width='1.2'>
                  <path d='M20 20 L30 26 L20 32'/>
                  <path d='M60 20 L70 26 L60 32'/>
                  <path d='M100 20 L110 26 L100 32'/>
                  <path d='M20 60 L30 66 L20 72'/>
                  <path d='M60 60 L70 66 L60 72'/>
                  <path d='M100 60 L110 66 L100 72'/>
                  <path d='M20 100 L30 106 L20 112'/>
                  <path d='M60 100 L70 106 L60 112'/>
                  <path d='M100 100 L110 106 L100 112'/>
                  <circle cx='40' cy='46' r='2.5'/>
                  <circle cx='80' cy='46' r='2.5'/>
                  <circle cx='40' cy='86' r='2.5'/>
                  <circle cx='80' cy='86' r='2.5'/>
                </g>
              </svg>
            `)}")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-lapis-950/40 via-transparent to-lapis-950" />
        <div className="absolute -top-32 start-1/4 h-96 w-96 rounded-full bg-lapis-600/25 blur-[120px]" />
        <div className="absolute -bottom-20 end-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-[100px]" />
      </div>

      <div className="container-main relative py-12 lg:py-20">
        {/* العنوان الرئيسي */}
        <Reveal className="mb-10 text-center lg:mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-400 backdrop-blur-sm">
            <IshtarStar size={14} animated />
            {t.tagline}
            <span className="mx-1 h-3 w-px bg-gold-500/30" />
            <span className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              {t.live}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl font-kufi text-4xl font-bold leading-[1.15] text-balance sm:text-5xl lg:text-6xl">
            {locale === 'ar' ? (
              <>
                <span className="text-gold-gradient">العراق الآن</span>
                <span className="mx-3 text-sand-100/30">|</span>
                <span className="text-sand-100">حيث يُروى الخبر كاملاً</span>
              </>
            ) : locale === 'ku' ? (
              <>
                <span className="text-gold-gradient">عێراق ئێستا</span>
                <span className="mx-3 text-sand-100/30">|</span>
                <span className="text-sand-100">هەواڵ بە تەواوی</span>
              </>
            ) : (
              <>
                <span className="text-gold-gradient">Iraq Now</span>
                <span className="mx-3 text-sand-100/30">|</span>
                <span className="text-sand-100">The Full Story</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-sand-100/60 sm:text-base">
            {t.subtitle}
          </p>
        </Reveal>

        {/* شبكة الأخبار */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* الخبر الرئيسي */}
          <Reveal className="lg:col-span-7" direction="right">
            <article className="group relative h-full min-h-[420px] overflow-hidden rounded-3xl border border-gold-500/20 shadow-2xl shadow-lapis-950/50 lg:min-h-[560px]">
              <Image
                src={FEATURED.image}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lapis-950 via-lapis-950/55 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="badge badge-live !px-3 !py-1 text-xs font-bold">
                    <Flame className="h-3.5 w-3.5" />
                    {locale === 'en' ? 'BREAKING' : 'عاجل'}
                  </span>
                  <Link
                    href={`/${locale}/category/${FEATURED.categorySlug}`}
                    className="badge border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    {cat}
                  </Link>
                  <span className="badge border border-white/10 bg-white/5 text-sand-100/80 backdrop-blur-sm">
                    <MapPin className="h-3 w-3" />
                    {loc}
                  </span>
                </div>

                <Link href={`/${locale}/article/${FEATURED.slug}`} className="group/title">
                  <h2 className="mb-3 font-kufi text-2xl font-bold leading-snug text-white transition-colors group-hover/title:text-gold-300 sm:text-3xl lg:text-4xl">
                    {title}
                    <span className="ms-3 inline-block text-gold-400 transition-transform duration-300 group-hover/title:translate-x-1 rtl:group-hover/title:-translate-x-1">
                      <Arrow className="inline h-6 w-6" />
                    </span>
                  </h2>
                  <p className="mb-5 max-w-2xl text-sm leading-relaxed text-sand-100/75 line-clamp-2">
                    {FEATURED.excerpt[locale]}
                  </p>
                </Link>

                <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-xs text-sand-100/60">
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 font-kufi text-[10px] font-bold text-lapis-950">
                      {FEATURED.author.charAt(0)}
                    </span>
                    {FEATURED.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatRelativeTime(new Date(Date.now() - FEATURED.timeAgo * 3600000), locale)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                    {FEATURED.views.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {locale === 'en' ? 'reads' : 'قراءة'}
                  </span>
                  <button className="ms-auto flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 font-semibold text-gold-400 backdrop-blur-sm transition-all duration-300 hover:bg-gold-500 hover:text-lapis-950">
                    <Play className="h-3.5 w-3.5" />
                    {t.watch}
                  </button>
                </div>
              </div>
            </article>
          </Reveal>

          {/* الأخبار الجانبية */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-kufi text-sm font-bold text-gold-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
                </span>
                {t.latest}
              </h3>
              <Link
                href={`/${locale}/latest`}
                className="text-xs font-medium text-sand-100/50 transition-colors hover:text-gold-400"
              >
                {locale === 'en' ? 'View all' : 'عرض الكل'} →
              </Link>
            </div>

            {SIDE_ARTICLES.map((article, i) => (
              <Reveal key={article.id} delay={i * 90} className="flex-1">
                <Link
                  href={`/${locale}/article/${article.slug}`}
                  className="group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm transition-all duration-400 hover:border-gold-500/40 hover:bg-white/[0.08]"
                >
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-32">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {article.hot && (
                      <span className="absolute start-1.5 top-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {locale === 'en' ? 'LIVE' : 'عاجل'}
                      </span>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div>
                      <div className="mb-1.5 flex items-center gap-2 text-[10px]">
                        <span className="font-semibold text-gold-400">{article.category[locale]}</span>
                        <span className="h-2.5 w-px bg-white/15" />
                        <span className="text-sand-100/40">{article.location[locale]}</span>
                      </div>
                      <h4 className="font-kufi text-sm font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-gold-300 sm:text-[15px]">
                        {article.title[locale]}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-sand-100/45">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(new Date(Date.now() - article.timeAgo * 3600000), locale)}
                      </span>
                      <span>{article.author}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* شريط الإحصائيات السريع */}
        <Reveal delay={200}>
          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/10 pt-8 sm:grid-cols-4">
            {[
              { value: '18', label: locale === 'en' ? 'Governorates' : 'محافظة', ku: 'پارێزگا' },
              { value: '3', label: locale === 'en' ? 'Languages' : 'لغات', ku: 'زمان' },
              { value: '24/7', label: locale === 'en' ? 'Live Coverage' : 'تغطية مستمرة', ku: 'پەخشی بەردەوام' },
              { value: '120+', label: locale === 'en' ? 'Journalists' : 'صحفي', ku: 'ڕۆژنامەنووس' },
            ].map((stat, i) => (
              <div key={i} className="group text-center">
                <p className="font-kufi text-2xl font-bold text-gold-gradient sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] text-sand-100/50 transition-colors group-hover:text-sand-100/80">
                  {locale === 'ku' ? stat.ku : stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* حدود سفلية زخرفية */}
      <div className="relative h-6 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0 14px, rgba(212,175,55,0.25) 14px 16px, transparent 16px 30px)`,
          }}
        />
      </div>
    </section>
  )
}
