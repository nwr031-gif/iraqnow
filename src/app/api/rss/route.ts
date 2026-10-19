import { NextResponse } from 'next/server'
import { getArticles } from '@/lib/data'

const BASE = 'https://iraqnow.pages.dev'

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
    const { articles } = await getArticles({ limit: 50 })
    const items = articles.map((a) => {
      const tr = a.translations.find((t) => t.locale === 'ar') || a.translations[0]
      const title = escapeXml(tr?.title || 'بدون عنوان')
      const link = `${BASE}/ar/article/${a.slug}`
      const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString()
      const desc = escapeXml((tr?.excerpt || '').slice(0, 300))
      const mediaTag = a.image ? `<media:content url="${escapeXml(a.image)}" type="image/jpeg" />` : ''
      return `    <item>
      <title><![CDATA[${tr?.title || 'بدون عنوان'}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${tr?.excerpt || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(a.categorySlug || '')}</category>
      ${mediaTag}
    </item>`
    }).join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>العراق الآن — Iraq Now</title>
    <link>${BASE}/ar</link>
    <description>أخبار العراق والعالم على مدار الساعة — تغطية موثقة وتحليلات عميقة</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/rss" rel="self" type="application/rss+xml" />
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
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>العراق الآن</title></channel></rss>', {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    })
  }
}
