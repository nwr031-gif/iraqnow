import { Metadata } from 'next'
import Link from 'next/link'
import { Home, ChevronLeft, Newspaper } from 'lucide-react'
import { ArticleCard, type ArticleData } from '@/components/home/ArticleCard'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'
import { getArticles, getCategories } from '@/lib/data'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'آخر الأخبار',
  description: 'تغطية مستمرة على مدار الساعة — آخر أخبار العراق بالعربية والإنجليزية',
  alternates: { languages: { ar: '/ar/latest', en: '/en/latest' } },
}

const MAX_ARTICLES = 30

const UI: Record<'ar' | 'en', any> = {
  ar: {
    home: 'الرئيسية', title: 'آخر الأخبار', subtitle: 'تغطية مستمرة على مدار الساعة',
    all: 'كل الأقسام', count: 'مقال منشور', empty: 'قريباً', backHome: 'العودة للرئيسية',
    emptyDesc: 'غرفة الأخبار تجهّز أول التقارير. عد قريباً!', featured: 'الأبرز',
  },
  en: {
    home: 'Home', title: 'Latest News', subtitle: 'Continuous 24/7 coverage',
    all: 'All Sections', count: 'published articles', empty: 'Coming Soon', backHome: 'Back to Home',
    emptyDesc: 'Our newsroom is preparing the first stories. Check back soon!', featured: 'Top Story',
  },
}

export default async function LatestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en'
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const [{ articles, total }, allCategories] = await Promise.all([
    getArticles({ page: 1, limit: MAX_ARTICLES }),
    getCategories(),
  ])

  const mapArticle = (article: any) => {
    const cat = allCategories.find((c) => c.slug === article.categorySlug)
    return {
      ...article,
      media: article.image ? [{ media: { url: article.image, alt: '' } }] : [],
      category: cat ? { slug: cat.slug, translations: cat.translations } : undefined,
    }
  }

  const featured = articles[0] ? mapArticle(articles[0]) : null
  const secondBatch = articles.slice(1, 4).map(mapArticle)
  const rest = articles.slice(4).map(mapArticle)

  const catName = (cat: any) =>
    cat?.translations?.find((tr: any) => tr.locale === locale)?.name || cat?.translations?.[0]?.name || cat?.slug || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'en' ? 'Latest News' : 'آخر الأخبار',
    numberOfItems: total,
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* الرأس */}
      <section className="border-b border-line bg-[var(--background)] py-10 lg:py-14">
        <div className="container-main">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]">
              <Home className="h-3.5 w-3.5" /> {t.home}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="font-medium text-[var(--foreground)]">{t.title}</span>
          </nav>

          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">
                <IshtarStar size={12} />
                {t.subtitle}
              </p>
              <h1 className="flex items-center gap-3 font-kufi text-3xl font-bold tracking-tight lg:text-4xl">
                <Newspaper className="h-8 w-8 text-[var(--muted)]" />
                {t.title}
              </h1>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {total.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.count}
              </p>
            </div>
          </Reveal>

          {/* شرائح الأقسام */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="shrink-0 rounded-full bg-[var(--foreground)] px-4 py-2 text-xs font-semibold text-[var(--background)]">
              {t.all}
            </span>
            {allCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${locale}/category/${cat.slug}`}
                className="shrink-0 rounded-full border border-line px-4 py-2 text-xs font-medium text-[var(--muted)] transition-colors hover:border-line-strong hover:text-[var(--foreground)]"
              >
                {catName(cat)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-main py-10 lg:py-14">
        {!featured ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line-strong py-24 text-center">
            <IshtarStar size={48} />
            <p className="font-kufi text-xl font-bold text-[var(--foreground)]">{t.empty}</p>
            <p className="max-w-md text-sm text-[var(--muted)]">{t.emptyDesc}</p>
            <Link href={`/${locale}`} className="btn-primary mt-2 font-kufi">
              {t.backHome}
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* الأبرز + الثلاثة التالية */}
            <div className="grid gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <div className="mb-3 flex items-center gap-2">
                  <span className="badge badge-live text-[10px] font-bold">{t.featured}</span>
                </div>
                <ArticleCard article={featured as ArticleData} locale={locale} variant="featured" />
              </Reveal>

              <div className="flex flex-col gap-4 lg:col-span-5">
                {secondBatch.map((article, i) => (
                  <Reveal key={article.id} delay={i * 80}>
                    <ArticleCard article={article as ArticleData} locale={locale} variant="horizontal" />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* بقية المقالات */}
            {rest.length > 0 && (
              <div className="grid gap-6 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, i) => (
                  <Reveal key={article.id} delay={(i % 3) * 70}>
                    <ArticleCard article={article as ArticleData} locale={locale} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
