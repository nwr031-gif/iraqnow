import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ChevronLeft, ChevronRight, Home, TrendingUp, Newspaper } from 'lucide-react'
import { ArticleCard } from '@/components/home/ArticleCard'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { getCategoryBySlug, getArticles, getCategories } from '@/lib/data'
import type { Locale } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

const SORT_OPTIONS = [
  { value: 'latest', ar: 'الأحدث', ku: 'نوێترین', en: 'Latest' },
  { value: 'views', ar: 'الأكثر قراءة', ku: 'زۆرترین خوێندنەوە', en: 'Most Read' },
]

const UI: Record<Locale, any> = {
  ar: {
    home: 'الرئيسية', articles: 'مقال', sortBy: 'ترتيب حسب', latest: 'الأحدث', popular: 'الأكثر قراءة',
    loadMore: 'المقال التالي', prev: 'السابق', next: 'التالي', page: 'صفحة',
    noArticles: 'لا توجد مقالات في هذا القسم بعد', backHome: 'العودة للرئيسية',
    relatedCategories: 'أقسام أخرى', featured: 'مقالات مميزة',
  },
  ku: {
    home: 'سەرەکی', articles: 'وتار', sortBy: 'ڕیزکردن بەپێی', latest: 'نوێترین', popular: 'زۆرترین خوێندنەوە',
    loadMore: 'وتاری داهاتوو', prev: 'پێشوو', next: 'دواتر', page: 'لاپەڕە',
    noArticles: 'هیچ وتارێک نییە لەم بەشەدا', backHome: 'گەڕانەوە بۆ سەرەکی',
    relatedCategories: 'بەشەکانی تر', featured: 'وتاری تایبەت',
  },
  en: {
    home: 'Home', articles: 'articles', sortBy: 'Sort by', latest: 'Latest', popular: 'Most Read',
    loadMore: 'Next Page', prev: 'Previous', next: 'Next', page: 'Page',
    noArticles: 'No articles in this section yet', backHome: 'Back to Home',
    relatedCategories: 'More Sections', featured: 'Featured',
  },
}

const PAGE_SIZE = 9

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const category = await getCategoryBySlug(slug)
  const t = category?.translations.find((tr) => tr.locale === locale) || category?.translations[0]

  if (!category) return { title: 'القسم غير موجود' }

  return {
    title: t?.name || category.slug,
    description: t?.description || '',
    alternates: {
      languages: { ar: `/ar/category/${slug}`, ku: `/ku/category/${slug}`, en: `/en/category/${slug}` },
    },
    openGraph: { title: t?.name, description: t?.description, type: 'website' },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const { page: pageParam, sort: sortParam } = await searchParams
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as Locale
  const t = UI[locale]

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const page = Math.max(1, parseInt(pageParam || '1') || 1)
  const sort = (sortParam === 'views' ? 'views' : 'latest') as 'latest' | 'views'

  const [{ articles, total, pages }, allCategories] = await Promise.all([
    getArticles({ categorySlug: slug, page, limit: PAGE_SIZE, sort }),
    getCategories(),
  ])

  const catName = category.translations.find((tr) => tr.locale === locale)?.name || category.translations[0]?.name || slug
  const catDesc = category.translations.find((tr) => tr.locale === locale)?.description || ''
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const otherCategories = allCategories.filter((c) => c.slug !== slug).slice(0, 8)

  /* JSON-LD */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: catName,
    description: catDesc,
    inLanguage: locale === 'ku' ? 'ckb' : locale,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.home, item: `https://iraqnow.iq/${locale}` },
        { '@type': 'ListItem', position: 2, name: catName, item: `https://iraqnow.iq/${locale}/category/${slug}` },
      ],
    },
  }

  const buildUrl = (newPage: number, newSort?: string) => {
    const p = new URLSearchParams()
    if (newPage > 1) p.set('page', String(newPage))
    if ((newSort || sort) === 'views') p.set('sort', 'views')
    return `/${locale}/category/${slug}${p.toString() ? '?' + p.toString() : ''}`
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* رأس القسم */}
      <section className="relative overflow-hidden bg-lapis-950 py-14 text-white lg:py-20">
        <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-20 start-1/3 h-72 w-72 rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="container-main relative">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-sand-100/50">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-400">
              <Home className="h-3.5 w-3.5" />
              {t.home}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
            <span className="font-medium text-gold-400">{catName}</span>
          </nav>

          <Reveal>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-700 shadow-xl shadow-gold-500/20">
                <IshtarStar size={36} />
              </span>
              <div>
                <h1 className="font-kufi text-3xl font-bold lg:text-5xl">{catName}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-sand-100/60">
                  <Newspaper className="h-4 w-4 text-gold-500" />
                  {total.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.articles}
                </p>
              </div>
            </div>
            {catDesc && (
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-sand-100/60">{catDesc}</p>
            )}
          </Reveal>
        </div>
      </section>

      <div className="container-main py-10">
        {/* شريط الترتيب + الأقسام الأخرى */}
        <Reveal>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted)]">{t.sortBy}:</span>
              <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-1">
                {SORT_OPTIONS.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl(1, opt.value)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                      sort === opt.value
                        ? 'bg-gold-500 text-lapis-950'
                        : 'text-[var(--muted)] hover:text-gold-600'
                    }`}
                  >
                    {opt[locale]}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-1.5 overflow-x-auto lg:flex">
              {otherCategories.slice(0, 5).map((c) => (
                <Link
                  key={c.slug}
                  href={`/${locale}/category/${c.slug}`}
                  className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] transition-all hover:border-gold-500/40 hover:text-gold-600"
                >
                  {c.translations.find((tr) => tr.locale === locale)?.name || c.translations[0]?.name}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {/* شبكة المقالات */}
        {articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Newspaper className="h-12 w-12 text-[var(--muted)] opacity-40" />
            <p className="text-sm text-[var(--muted)]">{t.noArticles}</p>
            <Link href={`/${locale}`} className="btn-outline !py-2.5 text-xs">
              {t.backHome}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => {
                const cardArticle = {
                  ...article,
                  media: article.image ? [{ media: { url: article.image, alt: '' } }] : [],
                  category: {
                    slug: article.categorySlug,
                    translations: category.translations,
                  },
                }
                return (
                  <Reveal key={article.id} delay={(i % 3) * 80}>
                    <ArticleCard article={cardArticle as any} locale={locale} />
                  </Reveal>
                )
              })}
            </div>

            {/* الترقيم */}
            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildUrl(page - 1)}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-medium text-[var(--muted)] transition-all hover:border-gold-500/40 hover:text-gold-600"
                  >
                    <ChevronRight className="h-4 w-4 ltr:rotate-180" />
                    {t.prev}
                  </Link>
                )}

                <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-1">
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                    const p = i + 1
                    return (
                      <Link
                        key={p}
                        href={buildUrl(p)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          p === page
                            ? 'bg-gold-500 text-lapis-950'
                            : 'text-[var(--muted)] hover:bg-gold-500/10 hover:text-gold-600'
                        }`}
                      >
                        {p.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')}
                      </Link>
                    )
                  })}
                  {pages > 7 && <span className="flex h-9 w-9 items-center justify-center text-xs text-[var(--muted)]">…</span>}
                </div>

                {page < pages && (
                  <Link
                    href={buildUrl(page + 1)}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-medium text-[var(--muted)] transition-all hover:border-gold-500/40 hover:text-gold-600"
                  >
                    {t.next}
                    <ChevronLeft className="h-4 w-4 ltr:rotate-180" />
                  </Link>
                )}
              </nav>
            )}
          </>
        )}

        <CuneiformDivider variant="star" className="mt-14 opacity-40" />

        {/* الأقسام الأخرى */}
        <Reveal>
          <div className="mt-6">
            <h2 className="mb-6 flex items-center gap-2 font-kufi text-lg font-bold text-[var(--foreground)]">
              <TrendingUp className="h-5 w-5 text-gold-500" />
              {t.relatedCategories}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {otherCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${locale}/category/${c.slug}`}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40"
                >
                  <p className="font-kufi text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-gold-600">
                    {c.translations.find((tr) => tr.locale === locale)?.name || c.translations[0]?.name}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">
                    {c.articleCount.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.articles}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
