import { NextRequest, NextResponse } from 'next/server'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/* عدّاد مشاهدات حقيقي — يتجاهل عناكب البحث */
export async function POST(request: NextRequest) {
  try {
    const ua = request.headers.get('user-agent') || ''
    if (/bot|crawl|spider|slurp|preview|lighthouse|headless/i.test(ua)) {
      return new NextResponse(null, { status: 204 })
    }
    const body = await request.json().catch(() => ({}))
    const slug = String(body.slug || '').slice(0, 120)
    if (!slug || !/^[a-z0-9-]{3,120}$/.test(slug)) {
      return NextResponse.json({ error: 'slug غير صالح' }, { status: 400 })
    }
    const res = await fetch(`${SB_URL}/rest/v1/rpc/increment_view_count`, {
      method: 'POST',
      headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_slug: slug }),
    })
    if (!res.ok) return NextResponse.json({ error: 'فشل' }, { status: 500 })
    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}
