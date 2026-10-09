'use client'

import { Suspense } from 'react'
import { ArticleCard } from './ArticleCard'

interface LatestNewsProps {
  locale: 'ar' | 'ku' | 'en'
}

const mockArticles = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 5),
  slug: `article-${i + 5}`,
  breaking: i === 0,
  featured: false,
  publishedAt: new Date(Date.now() - (i + 1) * 2 * 60 * 60 * 1000).toISOString(),
  viewCount: Math.floor(Math.random() * 10000) + 1000,
  readingTime: Math.floor(Math.random() * 10) + 3,
  translations: [
    { locale: 'ar', title: `عنوان الخبر ${i + 1} باللغة العربية مع تفاصيل مهمة`, excerpt: `ملخص للخبر ${i + 1} يشرح المحتوى بإيجاز` },
    { locale: 'ku', title: `سەرەڕای هەواڵ ${i + 1} بە زمانی کوردی`, excerpt: `کورتکراوەی هەواڵ ${i + 1}` },
    { locale: 'en', title: `Article ${i + 1} Title in English`, excerpt: `Summary of article ${i + 1}` },
  ],
  media: [{ media: { url: `https://picsum.photos/seed/article${i + 5}/800/450`, alt: `Article ${i + 5} image` } }],
  category: { slug: ['politics', 'economy', 'security', 'society', 'culture', 'sports', 'technology', 'health', 'education', 'environment'][i % 10], translations: [{ locale: 'ar', name: 'السياسة' }] },
  author: { name: `Author ${i + 1}` },
  location: { governorate: { translations: [{ locale: 'ar', name: 'بغداد' }] } },
}))

export function LatestNews({ locale }: LatestNewsProps) {
  return (
    <section className="py-8 lg:py-12" aria-labelledby="latest-heading">
      <div className="container-main">
        <div className="flex items-center justify-between mb-6">
          <h2 id="latest-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
            {locale === 'ar' ? 'أحدث الأخبار' : locale === 'ku' ? 'هەواڵە تازەکەکان' : 'Latest News'}
          </h2>
          <Link
            href={`/${locale}/latest`}
            className="text-sm font-medium text-accent hover:underline"
          >
            {locale === 'ar' ? 'عرض الكل' : locale === 'ku' ? 'ھەمووی پیشان بدە' : 'View All'}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockArticles.map((article) => (
            <Suspense key={article.id} fallback={<div className="h-80 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />}>
              <ArticleCard article={article} locale={locale} />
            </Suspense>
          ))}
        </div>
      </div>
    </section>
  )
}