import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Home, ChevronLeft, Newspaper } from 'lucide-react'
import { ArticleCard, type ArticleData } from '@/components/home/ArticleCard'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'
import { getArticles } from '@/lib/data'
import { getCategories } from '@/lib/data'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'آخر الأخبار',
  description: 'تغطية مستمرة على مدار الساعة — آخر أخبار العراق بثلاث لغات',
  alternates: { languages: { ar: '/ar/latest', ku: '/ku/latest', en: '/en/latest' } },
}

const PAGE_SIZE = 12

export default async function LatestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale: rawLocale } = await params
  const { page: pageParam } = await searchParams
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as 'ar' | 'ku' | 'en'
  const page = Math.max(1, parseInt(pageParam || '1') || 1)
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const [{ articles, total, pages }, allCategories] = await Promise.all([
    getArticles({ page, limit: PAGE_SIZE }),
    getCategories(),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'en' ? 'Latest News' : 'آخر الأخبار',
    numberOfItems: total,
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden bg-lapis-950 py-12 text-white">
        <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-30" aria-hidden="true" />
        <div className="container-main relative">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-sand-100/50">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 hover:text-gold-400">
              <Home className="h-3.5 w-3.5" /> {locale === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="text-gold-400">{locale === 'en' ? 'Latest' : 'آخر الأخبار'}</span>
          </nav>
          <h1 className="flex items-center gap-3 font-kufi text-3xl font-bold lg:text-4xl">
            <Newspaper className="h-8 w-8 text-gold-500" />
            {locale === 'en' ? 'Latest News' : locale === 'ku' ? 'دوایین هەواڵەکان' : 'آخر الأخبار'}
          </h1>
          <p className="mt-2 text-sm text-sand-100/50">{total} مقال منشور</p>
        </div>
      </section>

      <div className="container-main py-10">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gold-500/30 py-24 text-center" dir={dir}>
            <IshtarStar size={48} />
            <p className="font-kufi text-xl font-bold text-[var(--foreground)]">
              {locale === 'en' ? 'Coming Soon' : locale === 'ku' ? 'بەم زووانە' : 'قريباً'}
            </p>
            <p className="max-w-md text-sm text-[var(--muted)]">
              {locale === 'en'
                ? 'Our newsroom is preparing the first stories. Check back soon!'
                : locale === 'ku'
                  ? 'غرفة هەواڵەکان ئامادەی یەکەم ڕاپۆرتەکان دەکات. بەم زووانە بگەڕێوە!'
                  : 'غرفة الأخبار تجهّز أول التقارير. عد قريباً!'}
            </p>
            <Link href={`/${locale}`} className="btn-primary mt-2 font-kufi">
              {locale === 'en' ? 'Back to Home' : locale === 'ku' ? 'گەڕانەوە بۆ سەرەکی' : 'العودة للرئيسية'}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => {
            const cat = allCategories.find((c) => c.slug === article.categorySlug)
            const cardArticle = {
              ...article,
              media: article.image ? [{ media: { url: article.image, alt: '' } }] : [],
              category: cat ? { slug: cat.slug, translations: cat.translations } : undefined,
            }
            return (
              <Reveal key={article.id} delay={(i % 3) * 70}>
                <ArticleCard article={cardArticle as any} locale={locale} />
              </Reveal>
            )
          })}
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex justify-center gap-2">
            {page > 1 && (
              <Link href={`/${locale}/latest?page=${page - 1}`} className="rounded-xl border border-gold-500/40 px-5 py-2.5 text-sm font-semibold text-gold-600 hover:bg-gold-500 hover:text-lapis-950">
                السابق
              </Link>
            )}
            <span className="rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-lapis-950">{page}</span>
            {page < pages && (
              <Link href={`/${locale}/latest?page=${page + 1}`} className="rounded-xl border border-gold-500/40 px-5 py-2.5 text-sm font-semibold text-gold-600 hover:bg-gold-500 hover:text-lapis-950">
                التالي
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
