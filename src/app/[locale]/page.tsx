import { Metadata } from 'next'
import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { LatestNews } from '@/components/home/LatestNews'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { TrendingTopics } from '@/components/home/TrendingTopics'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { IraqMapSection } from '@/components/home/IraqMapSection'
import { PodcastSection } from '@/components/home/PodcastSection'
import { DataSection } from '@/components/home/DataSection'
import { CuneiformDivider } from '@/components/brand/Brand'
import { getArticles, getPodcasts, getCategories } from '@/lib/data'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'الرئيسية',
  description:
    'العراق الآن — بوابة إخبارية عراقية مستقلة متعددة اللغات. أخبار عاجلة، تقارير معمقة، خرائط تفاعلية، صحافة بيانات، وبودكاست من قلب بغداد.',
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = (['ar', 'ku', 'en'].includes(resolvedParams.locale) ? resolvedParams.locale : 'ar') as 'ar' | 'ku' | 'en'

  /* جلب البيانات من Supabase — فارغة عند الإطلاق */
  const [{ articles }, categories, podcasts] = await Promise.all([
    getArticles({ limit: 9 }),
    getCategories(),
    getPodcasts(3),
  ])

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-96 animate-pulse bg-lapis-950" />}>
        <HeroSection locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--background)]" />}>
        <LatestNews locale={locale} articles={articles as any} />
      </Suspense>

      <CuneiformDivider variant="star" className="opacity-40" />

      <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--background)]" />}>
        <CategoryShowcase locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-lapis-950" />}>
        <IraqMapSection locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-lapis-950" />}>
        <DataSection locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--background)]" />}>
        <PodcastSection locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-lapis-950" />}>
        <NewsletterSignup locale={locale} />
      </Suspense>
    </div>
  )
}
