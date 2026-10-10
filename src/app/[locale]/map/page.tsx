import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Home, ChevronLeft, Newspaper, MapPin } from 'lucide-react'
import { Iraq3DMap } from '@/components/map/Iraq3DMap'
import { GovernorateIndex } from '@/components/data/Interactive'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { GOVERNORATES_19 } from '@/components/map/Iraq3DMapCanvas'

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

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as 'ar' | 'ku' | 'en'
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Map',
    name: locale === 'en' ? 'Iraq Interactive 3D Map' : 'خريطة العراق 3D التفاعلية',
    url: `https://iraqnow.iq/${locale}/map`,
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* الرأس */}
      <section className="relative overflow-hidden bg-lapis-950 py-14 text-white lg:py-20">
        <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-40" aria-hidden="true" />
        <div className="container-main relative">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-sand-100/50">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-400">
              <Home className="h-3.5 w-3.5" />
              {locale === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="font-medium text-gold-400">{locale === 'en' ? '3D Map' : 'الخريطة 3D'}</span>
          </nav>

          <Reveal className="text-center">
            <span className="badge mx-auto mb-5 border border-gold-500/30 bg-gold-500/10 text-gold-400">
              <MapPin className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h1 className="font-kufi text-3xl font-bold lg:text-5xl">
              <span className="text-gold-gradient">{t.title}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-sand-100/60 lg:text-base">{t.subtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* الخريطة 3D */}
      <section className="container-main relative z-10 -mt-6 pb-6">
        <Suspense fallback={<div className="h-[560px] animate-pulse rounded-3xl bg-lapis-950" />}>
          <Iraq3DMap locale={locale} height={560} />
        </Suspense>
      </section>

      {/* فهرس المحافظات */}
      <section className="container-main py-10">
        <CuneiformDivider variant="star" className="mb-8 opacity-50" />
        <Reveal>
          <h2 className="section-title mb-6 font-kufi text-2xl font-bold lg:text-3xl">{t.allGovs}</h2>
        </Reveal>
        <GovernorateIndex governorates={GOVERNORATES_19} locale={locale} labels={{ allGovs: t.allGovs, articles: t.articles }} />
      </section>
    </div>
  )
}

