'use client'

import Link from 'next/link'
import { ArticleCard } from './ArticleCard'
import { NAV_CATEGORIES } from '@/lib/constants'

interface CategorySectionsProps {
  locale: 'ar' | 'ku' | 'en'
}

const categoryLabels = {
  ar: { politics: 'السياسة', economy: 'الاقتصاد', security: 'الأمن', society: 'المجتمع', culture: 'الثقافة', sports: 'الرياضة', technology: 'التكنولوجيا', health: 'الصحة', education: 'التعليم', environment: 'البيئة', local: 'محليات', world: 'العالم' },
  ku: { politics: 'سیاسەت', economy: 'أپووری', security: 'ئاسایش', society: 'کۆمەڵگە', culture: 'چанд', sports: 'وەرزش', technology: 'تەکنەلۆژی', health: 'تەندروستی', education: 'پەروەردە', environment: 'ژینگە', local: 'ناوخۆ', world: ' جیھان' },
  en: { politics: 'Politics', economy: 'Economy', security: 'Security', society: 'Society', culture: 'Culture', sports: 'Sports', technology: 'Technology', health: 'Health', education: 'Education', environment: 'Environment', local: 'Local', world: 'World' },
}

const mockCategoryArticles = (categorySlug: string) => Array.from({ length: 4 }, (_, i) => ({
  id: `${categorySlug}-${i}`,
  slug: `${categorySlug}-article-${i}`,
  breaking: i === 0,
  featured: false,
  publishedAt: new Date(Date.now() - (i + 1) * 3 * 60 * 60 * 1000).toISOString(),
  viewCount: Math.floor(Math.random() * 5000) + 500,
  readingTime: Math.floor(Math.random() * 8) + 2,
  translations: [
    { locale: 'ar', title: `${categoryLabels.ar[categorySlug as keyof typeof categoryLabels.ar]}: خبر ${i + 1}`, excerpt: `ملخص خبر ${categoryLabels.ar[categorySlug as keyof typeof categoryLabels.ar]} رقم ${i + 1}` },
    { locale: 'ku', title: `${categoryLabels.ku[categorySlug as keyof typeof categoryLabels.ku]}: هەواڵ ${i + 1}`, excerpt: `کورتکراوەی ${categoryLabels.ku[categorySlug as keyof typeof categoryLabels.ku]} ${i + 1}` },
    { locale: 'en', title: `${categoryLabels.en[categorySlug as keyof typeof categoryLabels.en]}: Article ${i + 1}`, excerpt: `Summary of ${categoryLabels.en[categorySlug as keyof typeof categoryLabels.en]} ${i + 1}` },
  ],
  media: [{ media: { url: `https://picsum.photos/seed/${categorySlug}${i}/800/450`, alt: `${categorySlug} article ${i}` } }],
  category: { slug: categorySlug, translations: [{ locale: 'ar', name: categoryLabels.ar[categorySlug as keyof typeof categoryLabels.ar] }] },
  author: { name: `Reporter ${i + 1}` },
  location: { governorate: { translations: [{ locale: 'ar', name: 'بغداد' }] } },
}))

export function CategorySections({ locale }: CategorySectionsProps) {
  const labels = categoryLabels[locale]
  const mainCategories = NAV_CATEGORIES.slice(0, 6)

  return (
    <section className="py-8 lg:py-12" aria-labelledby="categories-heading">
      <div className="container-main">
        <h2 id="categories-heading" className="sr-only">
          {locale === 'ar' ? 'الأقسام' : locale === 'ku' ? 'بەشەکان' : 'Categories'}
        </h2>
        <div className="space-y-12">
          {mainCategories.map((cat) => (
            <div key={cat.slug} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <span className="text-lg font-bold">{cat.slug.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {labels[cat.slug as keyof typeof labels]}
                  </h3>
                </div>
                <Link
                  href={`/${locale}/category/${cat.slug}`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {locale === 'ar' ? 'المزيد' : locale === 'ku' ? 'زۆرتر' : 'More'}
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {mockCategoryArticles(cat.slug).map((article, i) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    locale={locale}
                    variant={i === 0 ? 'featured' : 'default'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}