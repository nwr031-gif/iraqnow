import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

interface RssArticle {
  slug: string
  publishedAt: Date | null
  translations: Array<{ locale: string; title: string; excerpt: string; content: string }>
  category: { translations: Array<{ locale: string; name: string }> }
  author: { name: string | null }
  media: Array<{ media: { url: string } }>
}

function escapeXml(unsafe: string) {
  const AMP = String.fromCharCode(38)
  return unsafe
    .replace(/&/g, AMP + 'amp;')
    .replace(/</g, AMP + 'lt;')
    .replace(/>/g, AMP + 'gt;')
    .replace(/'/g, AMP + '#39;')
    .replace(/"/g, AMP + 'quot;')
}

export async function GET() {
  try {
    const db = await getPrisma()
    if (!db) {
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>IraqNow</title></channel></rss>', {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      })
    }

    const articles = await db.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        translations: true,
        category: { include: { translations: true } },
        author: true,
        media: { include: { media: true }, take: 1 },
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    })

    const items = (articles as unknown as RssArticle[]).map((article) => {
      const ar = article.translations.find((t) => t.locale === 'ar')
      const pubDate = article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString()
      const cat = article.category.translations.find((t) => t.locale === 'ar')?.name || ''
      const mediaTag = article.media[0] ? `<media:content url="${escapeXml(article.media[0].media.url)}" type="image/jpeg" />` : ''
      return `    <item>
      <title><![CDATA[${ar?.title || 'بدون عنوان'}]]></title>
      <link>https://iraqnow.com/ar/article/${article.slug}</link>
      <guid isPermaLink="true">https://iraqnow.com/ar/article/${article.slug}</guid>
      <description><![CDATA[${ar?.excerpt || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(cat)}</category>
      <author>${escapeXml(article.author.name || 'IraqNow')}</author>
      ${mediaTag}
    </item>`
    }).join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>IraqNow - أخبار العراق</title>
    <link>https://iraqnow.com</link>
    <description>منصة إخبارية عراقية شاملة متعددة اللغات</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://iraqnow.com/rss" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    })
  } catch (error) {
    console.error('RSS generation error:', error)
    return new NextResponse('Error generating RSS', { status: 500 })
  }
}
