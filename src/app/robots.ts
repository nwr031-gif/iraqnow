import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/admin'] },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Googlebot-News', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
    sitemap: [
      'https://iraqnow.pages.dev/sitemap.xml',
      'https://iraqnow.pages.dev/news-sitemap.xml',
    ],
  }
}
