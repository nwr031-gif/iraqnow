import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        translations: true,
        category: { include: { translations: true } },
        author: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    })

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>IraqNow - أخبار العراق</title>
    <link>https://iraqnow.com</link>
    <description>منصة إخبارية عراقية شاملة متعددة اللغات</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://iraqnow.com/rss" rel="self" type="application/rss+xml" />
    ${articles.map(article => {
      const ar = article.translations.find(t => t.locale === 'ar')
      const pubDate = article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString()
      const cat = article.category.translations.find(t => t.locale === 'ar')?.name || ''
      return `
    <item>
      <title><![CDATA[${ar?.title || 'بدون عنوان'}]]></title>
      <link>https://iraqnow.com/ar/article/${article.slug}</link>
      <guid isPermaLink="true">https://iraqnow.com/ar/article/${article.slug}</guid>
      <description><![CDATA[${ar?.excerpt || ''}]]></description>
      <content:encoded><![CDATA[${ar?.content || ''}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <category>${cat}</category>
      <author>${article.author.name || 'IraqNow'}</author>
      ${article.media[0] ? `<media:content url="${article.media[0].media.url}" type="image/jpeg" />` : ''}
    </item>`
    }).join('')}
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