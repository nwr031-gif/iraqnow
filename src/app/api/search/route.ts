import { NextRequest, NextResponse } from 'next/server'
import { searchArticles, getArticleSuggestions } from '@/lib/meilisearch'

export const dynamic = 'force-dynamic'

/* حد معدل بسيط في الذاكرة — 30 طلباً/دقيقة لكل IP */
const hits = new Map<string, number[]>()
const WINDOW = 60_000
const MAX_PER_WINDOW = 30

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW)
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 500) {
    for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW)) hits.delete(k)
  }
  return list.length > MAX_PER_WINDOW
}

function sanitizeQuery(q: string): string {
  return q.slice(0, 100).replace(/[\u0000-\u001f<>]/g, '').trim()
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'anon'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'طلبات كثيرة — انتظر قليلاً' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'search'

  try {
    if (action === 'search') {
      const q = sanitizeQuery(searchParams.get('q') || '')
      const categorySlug = sanitizeQuery(searchParams.get('category') || '')
      const governorateSlug = sanitizeQuery(searchParams.get('governorate') || '')
      const breaking = searchParams.get('breaking') === 'true'
      const featured = searchParams.get('featured') === 'true'
      const sortParam = searchParams.get('sort')
      const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10) || 20, 50)
      const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0)

      const result = await searchArticles({
        q,
        categorySlug: categorySlug || undefined,
        governorateSlug: governorateSlug || undefined,
        breaking: searchParams.has('breaking') ? breaking : undefined,
        featured: searchParams.has('featured') ? featured : undefined,
        sort: sortParam ? [sortParam] : undefined,
        limit,
        offset,
        facets: ['categorySlug'],
      })

      return NextResponse.json(result)
    }

    if (action === 'suggest') {
      const q = sanitizeQuery(searchParams.get('q') || '')
      if (q.length < 2) return NextResponse.json({ hits: [] })
      const result = await getArticleSuggestions(q, 5)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
