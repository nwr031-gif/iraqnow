import { MetadataRoute } from 'next'

const LOCALES = ['ar', 'ku', 'en'] as const
const BASE_URL = 'https://iraqnow.iq'

const CATEGORIES = [
  'politics', 'economy', 'security', 'society', 'culture', 'sports',
  'technology', 'health', 'education', 'environment', 'local', 'world',
]

const STATIC_PAGES = ['', '/latest', '/map', '/data', '/podcasts', '/trending', '/newsletter']

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const locale of LOCALES) {
    const languages = {
      ar: `${BASE_URL}/ar`,
      ku: `${BASE_URL}/ku`,
      en: `${BASE_URL}/en`,
      'x-default': `${BASE_URL}/ar`,
    }

    /* الصفحات الثابتة */
    for (const page of STATIC_PAGES) {
      urls.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' || page === '/latest' ? 'hourly' : 'daily',
        priority: page === '' ? 1 : 0.8,
        alternates: { languages },
      })
    }

    /* صفحات الأقسام */
    for (const cat of CATEGORIES) {
      urls.push({
        url: `${BASE_URL}/${locale}/category/${cat}`,
        lastModified: now,
        changeFrequency: 'hourly',
        priority: 0.9,
        alternates: {
          languages: {
            ar: `${BASE_URL}/ar/category/${cat}`,
            ku: `${BASE_URL}/ku/category/${cat}`,
            en: `${BASE_URL}/en/category/${cat}`,
          },
        },
      })
    }
  }

  return urls
}
