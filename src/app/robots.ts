import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/dashboard/', '/profile/', '/bookmarks/'],
    },
    sitemap: 'https://iraqnow.pages.dev/sitemap.xml',
    host: 'https://iraqnow.pages.dev',
  }
}
