import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Home, ChevronLeft, Newspaper, MapPin } from 'lucide-react'
import { Iraq3DMap } from '@/components/map/Iraq3DMap'
import { GovernorateIndex } from '@/components/data/Interactive'
import { Reveal } from '@/components/ui/Reveal'
import { GOVERNORATES_19 } from '@/lib/governorates'
import { getGovernorateCounts } from '@/lib/governorate-counts'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'خريطة العراق 3D التفاعلية',
  description: 'خريطة العراق ثلاثية الأبعاد التفاعلية — استكشف أخبار جميع المحافظات الـ 19 من زاخو إلى الفاو',
  alternates: { languages: { ar: '/ar/map', ku: '/ku/map', en: '/en/map' } },
}

const UI: Record<string, any> = {
  ar: {
    badge: 'خريطة تفاعلية ثلاثية الأبعاد', title: 'استكشف العراق من الأعلى',
    subtitle: 'خريطة 3D حية لجميع المحافظات الـ 19 — اسحب للتدوير، انقر على أي محافظة لقراءة أخبارها',
    explore: 'أخبار المحافظات', allGovs: 'جميع المحافظات الـ 19', articles: 'خبر', view: 'تصفح',
  },
  ku: {
    badge: 'نەخشەی 3D بەراوەر', title: 'عێراق لە سەرەوە ببینە',
    subtitle: 'نەخشەی 3D بۆ هەموو ١٩ پارێزگاکان — ڕاکێشان بۆ سووڕان، کرتە بۆ هەواڵەکان',
    explore: 'هەواڵی پارێزگاکان', allGovs: 'هەموو ١٩ پارێزگاکان', articles: 'هەواڵ', view: 'ببینە',
  },
  en: {
    badge: 'Interactive 3D Map', title: 'Explore Iraq From Above',
    subtitle: 'A live 3D map of all 19 governorates — drag to rotate, click any governorate to read its news',
    explore: 'Governorate News', allGovs: 'All 19 Governorates', articles: 'articles', view: 'Browse',
  },
}

/* أعداد المقالات الحقيقية حسب المحافظة — تُبنى وقت البناء */
export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as 'ar' | 'ku' | 'en'
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const counts = await getGovernorateCounts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Map',
    name: locale === 'en' ? 'Iraq Interactive 3D Map' : 'خريطة العراق 3D التفاعلية',
    url: `https://iraqnow.pages.dev/${locale}/map`,
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* الرأس */}
      <section className="relative overflow-hidden border-b border-line bg-[var(--background)] py-14 lg:py-20">
        <div className="container-main relative">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-[var(--muted)]">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]">
              <Home className="h-3.5 w-3.5" />
              {locale === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="font-medium text-[var(--foreground)]">{locale === 'en' ? '3D Map' : 'الخريطة 3D'}</span>
          </nav>

          <Reveal className="text-center">
            <span className="badge badge-lapis mx-auto mb-5">
              <MapPin className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h1 className="font-kufi text-3xl font-bold tracking-tight lg:text-5xl">
              {t.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--muted)] lg:text-base">{t.subtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* الخريطة 3D */}
      <section className="container-main relative z-10 -mt-4 pt-6 pb-8">
        <Suspense fallback={<div className="h-[560px] animate-pulse rounded-3xl border border-line bg-cream" />}>
          <Iraq3DMap locale={locale} height={560} counts={counts} />
        </Suspense>
      </section>

      {/* فهرس المحافظات */}
      <section className="container-main border-t border-line py-12">
        <Reveal className="mb-8">
          <p className="eyebrow mb-3">
            <MapPin className="h-3 w-3" />
            {t.explore}
          </p>
          <h2 className="section-title text-2xl lg:text-3xl">{t.allGovs}</h2>
        </Reveal>
        <GovernorateIndex
          governorates={GOVERNORATES_19.map((g) => ({
            ...g,
            articles: counts ? counts[g.slug] || 0 : g.articles,
            hot: counts ? (counts[g.slug] || 0) > 0 : g.hot,
          }))}
          locale={locale}
          labels={{ allGovs: t.allGovs, articles: t.articles }}
        />
      </section>
    </div>
  )
}
