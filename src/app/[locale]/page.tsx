import { Metadata } from 'next'
import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { LatestNews } from '@/components/home/LatestNews'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { MostRead } from '@/components/home/MostRead'
import { BreakingNews } from '@/components/home/BreakingNews'
import { IraqMapSection } from '@/components/home/IraqMapSection'
import { PodcastSection } from '@/components/home/PodcastSection'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { DataSection } from '@/components/home/DataSection'
import { getArticles, getPodcasts, getCategories } from '@/lib/data'
import { getGovernorateCounts } from '@/lib/governorate-counts'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'الرئيسية',
  description:
    'العراق الآن — بوابة إخبارية عراقية مستقلة. أخبار عاجلة، تقارير معمقة، خرائط تفاعلية، صحافة بيانات، وبودكاست من قلب بغداد.',
}

const CATEGORY_LABELS: Record<string, { ar: string; ku: string; en: string }> = {
  politics: { ar: 'السياسة', ku: 'سیاسەت', en: 'Politics' },
  economy: { ar: 'الاقتصاد', ku: 'ئابووری', en: 'Economy' },
  security: { ar: 'الأمن', ku: 'ئاسایش', en: 'Security' },
  society: { ar: 'المجتمع', ku: 'کۆمەڵگە', en: 'Society' },
  culture: { ar: 'الثقافة', ku: 'چاند', en: 'Culture' },
  sports: { ar: 'الرياضة', ku: 'وەرزش', en: 'Sports' },
  technology: { ar: 'التكنولوجيا', ku: 'تەکنەلۆژی', en: 'Technology' },
  health: { ar: 'الصحة', ku: 'تەندروستی', en: 'Health' },
  education: { ar: 'التعليم', ku: 'پەروەردە', en: 'Education' },
  environment: { ar: 'البيئة', ku: 'ژینگە', en: 'Environment' },
  local: { ar: 'محليات', ku: 'ناوخۆ', en: 'Local' },
  world: { ar: 'العالم', ku: 'جیھان', en: 'World' },
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = (['ar', 'ku', 'en'].includes(resolvedParams.locale) ? resolvedParams.locale : 'ar') as 'ar' | 'ku' | 'en'

  /* جلب البيانات من Supabase — فارغة عند الإطلاق */
  const [{ articles, total }, categories, podcasts, govCounts] = await Promise.all([
    getArticles({ limit: 30 }),
    getCategories(),
    getPodcasts(3),
    getGovernorateCounts(),
  ])

  const catLabel = (slug: string) =>
    CATEGORY_LABELS[slug]?.[locale] || CATEGORY_LABELS[slug]?.ar || slug

  /* العاجل: فقط الأخبار الموسومة عاجلاً خلال آخر 24 ساعة */
  const dayAgo = Date.now() - 24 * 3600_000
  const breakingItems = articles
    .filter((a) => a.breaking && a.publishedAt && new Date(a.publishedAt).getTime() > dayAgo)
    .slice(0, 5)
    .map((a) => {
      const tr = a.translations?.find((t) => t.locale === locale) || a.translations?.[0]
      return {
        id: a.id,
        slug: a.slug,
        title: tr?.title || '',
        categoryLabel: catLabel(a.categorySlug || ''),
      }
    })
    .filter((x) => x.title)

  /* الأكثر قراءة: بيانات حقيقية من عدّاد المشاهدات */
  const mostRead = [...articles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .filter((a) => (a.viewCount || 0) > 0)
    .slice(0, 6)
    .map((a) => {
      const tr = a.translations?.find((t) => t.locale === locale) || a.translations?.[0]
      return {
        id: a.id,
        slug: a.slug,
        title: tr?.title || '',
        categoryLabel: catLabel(a.categorySlug || ''),
        views: a.viewCount || 0,
      }
    })
    .filter((x) => x.title)

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-10 bg-[#0a0a0a]" />}>
        <BreakingNews locale={locale} items={breakingItems} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-cream" />}>
        <HeroSection locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--background)]" />}>
        <LatestNews locale={locale} articles={articles.slice(0, 9) as any} total={total} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-cream" />}>
        <MostRead locale={locale} items={mostRead} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--background)]" />}>
        <CategoryShowcase locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-cream" />}>
        <IraqMapSection locale={locale} counts={govCounts} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--background)]" />}>
        <DataSection locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-cream" />}>
        <NewsletterSignup locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-cream" />}>
        <PodcastSection locale={locale} episodes={podcasts as any} />
      </Suspense>
    </div>
  )
}
