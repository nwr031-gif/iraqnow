export const dynamic = 'force-dynamic'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BASE = 'https://iraqnow.pages.dev'

function esc(s: unknown) {
  return String(s || '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
}

export async function GET() {
  let items = ''
  try {
    const since = new Date(Date.now() - 48 * 3600_000).toISOString()
    const res = await fetch(
      `${SB_URL}/rest/v1/articles?select=slug,title_ar,title_en,published_at,updated_at&status=eq.PUBLISHED&published_at=gte.${encodeURIComponent(since)}&order=published_at.desc&limit=300`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } as Record<string, string>, cache: 'no-store' },
    )
    if (res.ok) {
      const rows = await res.json()
      items = rows.map((a: any) => {
          const date = a.published_at || a.updated_at
          const title = esc(a.title_ar || a.title_en || '')
          return `  <url>
    <loc>${BASE}/ar/article/${esc(a.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>العراق الآن</news:name>
        <news:language>ar</news:language>
      </news:publication>
      <news:publication_date>${new Date(date).toISOString()}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`
        })
        .join('\n')
    }
  } catch { /* خريطة فارغة عند الفشل */ }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900',
    },
  })
}
