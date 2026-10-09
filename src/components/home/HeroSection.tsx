'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, ChevronRight, ChevronLeft, MapPin, Clock, Flame, Users, Zap, Map } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface FeaturesData {
  icon: LucideIcon
  title: { ar: string; ku: string; en: string }
  desc: { ar: string; ku: string; en: string }
}

const features: FeaturesData[] = [
  { icon: Map, title: { ar: 'خرائط تفاعلية', ku: 'نەخشەی بەراوەر', en: 'Interactive Maps' }, desc: { ar: 'تصفح الأخبار جغرافياً', ku: 'هەواڵەکان بە جۆگرافیایی', en: 'Browse news geographically' } },
  { icon: Users, title: { ar: 'مجتمع تفاعلي', ku: 'کۆمەڵگەی بەراوەر', en: 'Interactive Community' }, desc: { ar: 'تعليقات ونقاشات بناءة', ku: 'تێبینی و مێژوو', en: 'Comments and discussions' } },
  { icon: Zap, title: { ar: 'تنبيهات فورية', ku: 'ئاگادارکردنەوەی بێدەنگ', en: 'Instant Alerts' }, desc: { ar: 'لا تفوت أي خبر مهم', ku: 'ھیچ هەواڵێکی گرنگ نەگەڕێت', en: 'Never miss important news' } },
]

interface Article {
  id: string
  slug: string
  breaking: boolean
  featured: boolean
  publishedAt: string
  viewCount: number
  translations: Array<{
    locale: 'ar' | 'ku' | 'en'
    title: string
    excerpt: string
  }>
  media: Array<{
    media: {
      url: string
      alt: string
    }
  }>
  category: {
    slug: string
    translations: Array<{ locale: 'ar' | 'ku' | 'en'; name: string }>
  }
  author: {
    name: string
  }
  location?: {
    governorate?: {
      translations: Array<{ locale: 'ar' | 'ku' | 'en'; name: string }>
    }
  }
}

interface HeroSectionProps {
  locale: 'ar' | 'ku' | 'en'
}

const mockHeroArticle: Article = {
  id: '1',
  slug: 'iraq-economic-reform-2026',
  breaking: true,
  featured: true,
  publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  viewCount: 15420,
  translations: [
    { locale: 'ar', title: 'العراق يعلن حزمة إصلاحات اقتصادية شاملة لمعالجة البطالة وتنويع الدخل', excerpt: 'رئيس الوزراء يكشف عن خطة خمسية جديدة تستهدف خلق 500 ألف فرصة عمل وتقليل الاعتماد على النفط إلى 60% بحلول 2030' },
    { locale: 'ku', title: 'عێراق پلانێکی گشتی ئابووری هەڵدەرێت بۆ چارەسەرکردنی بێکاری و جۆراوجۆی کردنەوەی داهات', excerpt: 'سەرۆک وەزیرەکان پلانێکی ٥ ساڵی تازە دەرکەوێت کە دەھێنێت ٥٠٠ هەزار بۆشایی کار دروست بکات' },
    { locale: 'en', title: 'Iraq Announces Comprehensive Economic Reform Package to Address Unemployment', excerpt: 'PM reveals new five-year plan targeting 500,000 jobs and reducing oil dependence to 60% by 2030' },
  ],
  media: [{ media: { url: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&h=675&fit=crop', alt: 'Iraq economic reform' } }],
  category: { slug: 'economy', translations: [{ locale: 'ar', name: 'الاقتصاد' }, { locale: 'ku', name: 'أپووری' }, { locale: 'en', name: 'Economy' }] },
  author: { name: 'أحمد الزبيدي' },
  location: { governorate: { translations: [{ locale: 'ar', name: 'بغداد' }, { locale: 'ku', name: 'بەغداد' }, { locale: 'en', name: 'Baghdad' }] } },
}

const mockSideArticles: Article[] = [
  {
    id: '2', slug: 'kurdistan-investment-law', breaking: false, featured: false,
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), viewCount: 8200,
    translations: [{ locale: 'ar', title: 'إقليم كردستان يقر قانون الاستثمار الجديد بجذب 3 مليارات دولار', excerpt: '' }, { locale: 'ku', title: 'هەرێمی کوردستان یاسای سەرمایەکاری نوێ دەستخەش دەکات', excerpt: '' }, { locale: 'en', title: 'KRG Passes New Investment Law Attracting $3B', excerpt: '' }],
    media: [{ media: { url: 'https://images.unsplash.com/photo-1504307651254-35680f3561d7?w=400&h=225&fit=crop', alt: 'Erbil investment' } }],
    category: { slug: 'economy', translations: [{ locale: 'ar', name: 'الاقتصاد' }] }, author: { name: 'سوران محمد' },
  },
  {
    id: '3', slug: 'baghdad-metro-project', breaking: true, featured: false,
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), viewCount: 12100,
    translations: [{ locale: 'ar', title: 'بدء المرحلة الأولى من مشروع مترو بغداد بطول 30 كم', excerpt: '' }, { locale: 'ku', title: 'دەستی پێکردن لە قۆناغی یەکەمی مێترۆی بەغداد', excerpt: '' }, { locale: 'en', title: 'Phase 1 of Baghdad Metro Launches - 30km', excerpt: '' }],
    media: [{ media: { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=225&fit=crop', alt: 'Baghdad metro' } }],
    category: { slug: 'local', translations: [{ locale: 'ar', name: 'محليات' }] }, author: { name: 'ليلى حسن' },
  },
  {
    id: '4', slug: 'iraq-climate-summit', breaking: false, featured: false,
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), viewCount: 5600,
    translations: [{ locale: 'ar', title: 'العراق يستضيف قمة مناخية إقليمية الشهر المقبل', excerpt: '' }, { locale: 'ku', title: 'عێراق چاوەڕوانکردنی سەرۆکایەتی کەش و ھەوای ناوچەوە دەکات', excerpt: '' }, { locale: 'en', title: 'Iraq to Host Regional Climate Summit Next Month', excerpt: '' }],
    media: [{ media: { url: 'https://images.unsplash.com/photo-1569163139544-8d8d71f9b594?w=400&h=225&fit=crop', alt: 'Climate summit' } }],
    category: { slug: 'environment', translations: [{ locale: 'ar', name: 'البيئة' }] }, author: { name: 'عمر عبد الله' },
  },
]

export function HeroSection({ locale }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const t = mockHeroArticle.translations.find(t => t.locale === locale) || mockHeroArticle.translations[0]
  const cat = mockHeroArticle.category.translations.find(t => t.locale === locale) || mockHeroArticle.category.translations[0]
  const loc = mockHeroArticle.location?.governorate?.translations.find(t => t.locale === locale) || mockHeroArticle.location?.governorate?.translations[0]

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="container-main relative py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <article className="lg:col-span-2 relative group">
            <Link href={`/${locale}/article/${mockHeroArticle.slug}`} className="block relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={mockHeroArticle.media[0].media.url}
                alt={mockHeroArticle.media[0].media.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {mockHeroArticle.breaking && (
                    <span className="flex items-center gap-1 rounded-full bg-error px-3 py-1 text-xs font-bold text-white animate-pulse">
                      <Flame className="h-3 w-3" />
                      {locale === 'ar' ? 'عاجل' : locale === 'ku' ? 'بەھێز' : 'BREAKING'}
                    </span>
                  )}
                  <Link
                    href={`/${locale}/category/${mockHeroArticle.category.slug}`}
                    className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/30"
                  >
                    {cat.name}
                  </Link>
                  {loc && (
                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm">
                      <MapPin className="h-3 w-3" />
                      {loc.name}
                    </span>
                  )}
                </div>
                <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {t.title}
                </h1>
                <p className="mb-4 text-base sm:text-lg text-white/90 line-clamp-2 max-w-2xl">
                  {t.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatRelativeTime(mockHeroArticle.publishedAt, locale)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4" style={{ maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpath d=%22M1 12s4-8 11-8 11 8 11 8-4 8-11 8%22/%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%223%22/%3E%3C/svg%3E")', WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpath d=%22M1 12s4-8 11-8 11 8-4 8-11 8%22/%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%223%22/%3E%3C/svg%22")' }} />
                    {mockHeroArticle.viewCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>{mockHeroArticle.author.name}</span>
                  </span>
                </div>
              </div>
            </Link>
          </article>

          <aside className="space-y-4">
            {mockSideArticles.map((article, i) => {
              const at = article.translations.find(t => t.locale === locale) || article.translations[0]
              const acat = article.category.translations.find(t => t.locale === locale) || article.category.translations[0]
              return (
                <Link
                  key={article.id}
                  href={`/${locale}/article/${article.slug}`}
                  className="group block relative aspect-[16/9] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Image
                    src={article.media[0].media.url}
                    alt={article.media[0].media.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent p-4 flex flex-col justify-end" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-1 mb-1">
                      {article.breaking && (
                        <span className="rounded-full bg-error px-2 py-0.5 text-[10px] font-bold text-white">
                          {locale === 'ar' ? 'عاجل' : locale === 'ku' ? 'بەھێز' : 'LIVE'}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-white/80 uppercase">{acat.name}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-accent transition-colors">
                      {at.title}
                    </h3>
                  </div>
                </Link>
              )
            })}
          </aside>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{feature.title[locale]}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc[locale]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}