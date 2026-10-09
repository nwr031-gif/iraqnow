import { MetadataRoute } from 'next'

const LOCALES = ['ar', 'ku', 'en'] as const
const BASE_URL = 'https://iraqnow.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    urls.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
      alternates: {
        languages: {
          ar: `${BASE_URL}/ar`,
          ku: `${BASE_URL}/ku`,
          en: `${BASE_URL}/en`,
        },
      },
    })

    urls.push({
      url: `${BASE_URL}/${locale}/latest`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    })

    urls.push({
      url: `${BASE_URL}/${locale}/map`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    })

    urls.push({
      url: `${BASE_URL}/${locale}/data`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    })

    urls.push({
      url: `${BASE_URL}/${locale}/podcasts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    })

    urls.push({
      url: `${BASE_URL}/${locale}/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.6,
    })
  }

  return urls
}